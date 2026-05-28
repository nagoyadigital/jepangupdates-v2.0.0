require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  const cat = await prisma.category.findUnique({ where: { slug: 'video' } });
  if (!cat) { console.log('Kategori video tidak ditemukan'); return; }
  
  // Delete tags on articles first
  const articles = await prisma.article.findMany({ where: { categoryId: cat.id }, select: { id: true } });
  for (const a of articles) {
    await prisma.tagOnArticle.deleteMany({ where: { articleId: a.id } });
  }
  
  const count = await prisma.article.deleteMany({ where: { categoryId: cat.id } });
  console.log('Deleted', count.count, 'articles');
  await prisma.category.delete({ where: { id: cat.id } });
  console.log('Deleted category: video');
  await prisma.$disconnect();
}
main();
