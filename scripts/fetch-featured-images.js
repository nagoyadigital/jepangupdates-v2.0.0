/**
 * Fetch featured images dari WordPress REST API dan update ke database
 * Jalankan: node scripts/fetch-featured-images.js
 */

require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');

const WP_URL = 'https://jepangupdates.com';
const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function fetchWPPosts(page = 1) {
  const url = `${WP_URL}/wp-json/wp/v2/posts?per_page=20&page=${page}&_embed=wp:featuredmedia`;
  const res = await fetch(url);
  if (!res.ok) return { posts: [], totalPages: 0 };
  const totalPages = parseInt(res.headers.get('x-wp-totalpages') || '0');
  const posts = await res.json();
  return { posts, totalPages };
}

async function main() {
  console.log('🖼️  Fetching featured images dari WordPress...\n');

  let page = 1;
  let totalPages = 1;
  let updated = 0;
  let skipped = 0;

  while (page <= totalPages) {
    const { posts, totalPages: tp } = await fetchWPPosts(page);
    if (page === 1) totalPages = tp;
    
    console.log(`  📄 Page ${page}/${totalPages} (${posts.length} posts)`);

    for (const post of posts) {
      const slug = post.slug;
      
      // Get featured image URL from embedded data
      let imageUrl = null;
      if (post._embedded && post._embedded['wp:featuredmedia'] && post._embedded['wp:featuredmedia'][0]) {
        const media = post._embedded['wp:featuredmedia'][0];
        // Prefer medium_large or large size
        if (media.media_details && media.media_details.sizes) {
          const sizes = media.media_details.sizes;
          imageUrl = sizes.large?.source_url || sizes.medium_large?.source_url || sizes.full?.source_url || media.source_url;
        } else {
          imageUrl = media.source_url;
        }
      }

      if (!imageUrl) {
        skipped++;
        continue;
      }

      // Find article in our database by slug
      const article = await prisma.article.findUnique({ where: { slug }, select: { id: true, featuredImage: true } });
      
      if (!article) {
        skipped++;
        continue;
      }

      if (article.featuredImage) {
        skipped++;
        continue; // Already has image
      }

      // Update with WordPress image URL
      await prisma.article.update({
        where: { slug },
        data: { featuredImage: imageUrl },
      });
      updated++;
    }

    page++;
    // Small delay to not overwhelm the server
    await new Promise(r => setTimeout(r, 500));
  }

  console.log(`\n🎉 Selesai!`);
  console.log(`  ✅ Updated: ${updated} artikel`);
  console.log(`  ⏭️  Skipped: ${skipped} (tidak ada gambar / sudah ada / tidak ditemukan)`);

  await prisma.$disconnect();
}

main().catch(e => { console.error('Error:', e.message); process.exit(1); });
