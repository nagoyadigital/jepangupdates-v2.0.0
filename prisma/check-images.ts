import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  const articles = await prisma.article.findMany({
    select: { slug: true, featuredImage: true },
    orderBy: { publishedAt: "desc" },
    take: 15,
  });
  articles.forEach((a) => console.log(a.slug, "|", a.featuredImage || "NO IMAGE"));
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
