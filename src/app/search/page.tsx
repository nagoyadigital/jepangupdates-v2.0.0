import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Footer } from "@/components/Footer";
import { StickySiteHeader } from "@/components/StickySiteHeader";
import { formatDateID } from "@/lib/utils";

export const dynamic = "force-dynamic";

type PageProps = { searchParams: Promise<{ q?: string }> };

export default async function SearchPage({ searchParams }: PageProps) {
  const { q } = await searchParams;
  const query = q || "";

  const articles = query
    ? await prisma.article.findMany({
        where: {
          status: "PUBLISHED",
          OR: [
            { title: { contains: query, mode: "insensitive" } },
            { excerpt: { contains: query, mode: "insensitive" } },
            { content: { contains: query, mode: "insensitive" } },
          ],
        },
        include: { category: { select: { name: true } }, author: { select: { name: true } } },
        orderBy: { publishedAt: "desc" },
        take: 20,
      })
    : [];

  return (
    <div className="min-h-screen bg-white text-[#111827]">
      <StickySiteHeader />
      <main className="mx-auto max-w-7xl px-3 py-6 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-black text-[#111827]">
          {query ? `Hasil pencarian: "${query}"` : "Pencarian"}
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          {articles.length > 0 ? `Ditemukan ${articles.length} artikel` : query ? "Tidak ada hasil" : "Masukkan kata kunci untuk mencari"}
        </p>

        {articles.length > 0 && (
          <div className="mt-8 space-y-7">
            {articles.map((article) => (
              <Link href={`/${article.slug}`} key={article.id} className="grid grid-cols-[120px_minmax(0,1fr)] items-start gap-3 sm:grid-cols-[220px_minmax(0,1fr)] sm:gap-4">
                <div className="relative h-[120px] overflow-hidden rounded-md bg-slate-100 sm:aspect-[16/10] sm:h-auto">
                  {article.featuredImage ? (
                    <Image src={article.featuredImage} alt={article.title} fill sizes="220px" className="object-cover" />
                  ) : (
                    <div className="flex h-full items-center justify-center text-xs text-slate-400">No image</div>
                  )}
                </div>
                <div className="pt-1">
                  <p className="text-[10px] font-black uppercase text-red-600">{article.category.name}</p>
                  <h3 className="mt-1 line-clamp-3 text-[14px] font-bold leading-snug text-[#111827] hover:text-[#1B5DAF] sm:text-xl sm:font-black">{article.title}</h3>
                  <p className="mt-1 text-[10px] text-slate-500 sm:text-xs">{article.publishedAt ? formatDateID(article.publishedAt) : ""}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
