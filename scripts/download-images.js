/**
 * Download semua featured images dari WordPress ke lokal /public/uploads/wp/
 * dan update URL di database ke path lokal.
 * 
 * Jalankan: node scripts/download-images.js
 */

require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads', 'wp');

function downloadFile(url) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;
    protocol.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        return downloadFile(res.headers.location).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        reject(new Error(`HTTP ${res.statusCode}`));
        return;
      }
      const chunks = [];
      res.on('data', (chunk) => chunks.push(chunk));
      res.on('end', () => resolve(Buffer.concat(chunks)));
      res.on('error', reject);
    }).on('error', reject);
  });
}

async function main() {
  console.log('📥 Downloading featured images ke lokal...\n');

  // Create upload directory
  if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true });
  }

  // Get all articles with external featured images
  const articles = await prisma.article.findMany({
    where: {
      featuredImage: { startsWith: 'http' },
    },
    select: { id: true, slug: true, featuredImage: true },
  });

  console.log(`  📝 ${articles.length} artikel dengan gambar external\n`);

  let downloaded = 0;
  let failed = 0;

  for (const article of articles) {
    try {
      const url = article.featuredImage;
      const ext = path.extname(new URL(url).pathname) || '.jpg';
      const filename = `${article.slug}${ext}`;
      const filePath = path.join(UPLOAD_DIR, filename);
      const localUrl = `/uploads/wp/${filename}`;

      // Skip if already downloaded
      if (fs.existsSync(filePath)) {
        await prisma.article.update({ where: { id: article.id }, data: { featuredImage: localUrl } });
        downloaded++;
        continue;
      }

      // Download
      const buffer = await downloadFile(url);
      fs.writeFileSync(filePath, buffer);

      // Update database with local path
      await prisma.article.update({ where: { id: article.id }, data: { featuredImage: localUrl } });

      downloaded++;
      if (downloaded % 10 === 0) console.log(`  ✅ ${downloaded}/${articles.length} downloaded...`);
    } catch (err) {
      failed++;
      console.log(`  ❌ Failed: ${article.slug} - ${err.message}`);
    }

    // Small delay
    await new Promise(r => setTimeout(r, 200));
  }

  console.log(`\n🎉 Selesai!`);
  console.log(`  ✅ Downloaded: ${downloaded}`);
  console.log(`  ❌ Failed: ${failed}`);
  console.log(`  📁 Folder: public/uploads/wp/`);

  await prisma.$disconnect();
}

main().catch(e => { console.error('Error:', e.message); process.exit(1); });
