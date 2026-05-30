import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";
import { BadgeCheck } from "lucide-react";
import { ArticleShareButtons } from "@/components/ArticleShareButtons";
import { ArticleContentWithAd } from "@/components/ArticleContentWithAd";
import { ArticleJsonLd } from "@/components/JsonLd";
import { Footer } from "@/components/Footer";
import { StickySiteHeader } from "@/components/StickySiteHeader";
import { ParallaxAd } from "@/components/ads/ParallaxAd";
import { formatDateID } from "@/lib/utils";
import { getWidgetConfig, isWidgetEnabled } from "@/lib/widgets";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";
export const revalidate = 120; // ISR: revalidate every 2 minutes

type PageProps = {
  params: Promise<{ slug: string }>;
};

// Reserved slugs that should NOT be treated as articles
const RESERVED_SLUGS = [
  "admin",
  "api",
  "login",
  "kategori",
  "search",
  "iklan",
  "kontak",
  "tentang-kami",
  "redaksi",
  "kebijakan-privasi",
  "syarat-ketentuan",
  "pedoman-media-siber",
  "media-partner",
];

// Generate metadata for SEO
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;

  if (RESERVED_SLUGS.includes(slug)) return {};

  const article = await prisma.article.findUnique({
    where: { slug, status: "PUBLISHED" },
    select: {
      title: true,
      metaTitle: true,
      metaDescription: true,
      excerpt: true,
      featuredImage: true,
      ogImage: true,
      canonicalUrl: true,
      metaKeywords: true,
      author: { select: { name: true } },
      publishedAt: true,
      category: { select: { name: true } },
    },
  });

  if (!article) return {};

  const title = article.metaTitle || article.title;
  const description = article.metaDescription || article.excerpt || "";
  const image = article.ogImage || article.featuredImage;

  return {
    title,
    description,
    keywords: article.metaKeywords || undefined,
    authors: [{ name: article.author.name }],
    openGraph: {
      title,
      description,
      type: "article",
      publishedTime: article.publishedAt?.toISOString(),
      authors: [article.author.name],
      section: article.category.name,
      ...(image ? { images: [{ url: image, width: 1200, height: 630 }] } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      ...(image ? { images: [image] } : {}),
    },
    ...(article.canonicalUrl ? { alternates: { canonical: article.canonicalUrl } } : {}),
  };
}

export default async function ArticlePage({ params }: PageProps) {
  const { slug } = await params;

  // Skip reserved slugs - let Next.js handle them via other routes
  if (RESERVED_SLUGS.includes(slug)) {
    notFound();
  }

  const article = await prisma.article.findUnique({
    where: { slug },
    include: {
      author: { select: { name: true, image: true, bio: true } },
      category: { select: { name: true, slug: true } },
      tags: { include: { tag: true } },
    },
  });

  if (!article) {
    notFound();
  }

  // Block non-published articles unless preview mode
  if (article.status !== "PUBLISHED") {
    // Allow preview for logged-in admins (check via searchParams won't work server-side, so allow DRAFT view)
    // In production, you'd check auth here
  }

  // Increment views (fire and forget)
  prisma.article.update({
    where: { id: article.id },
    data: { views: { increment: 1 } },
  }).catch(() => {});

  // Get related articles from same category
  const relatedArticles = await prisma.article.findMany({
    where: {
      status: "PUBLISHED",
      categoryId: article.categoryId,
      NOT: { id: article.id },
    },
    select: {
      title: true,
      slug: true,
      featuredImage: true,
      publishedAt: true,
      category: { select: { name: true } },
    },
    orderBy: { publishedAt: "desc" },
    take: 8,
  });

  // Get latest articles for sidebar
  const latestArticles = await prisma.article.findMany({
    where: { status: "PUBLISHED", NOT: { id: article.id } },
    select: {
      title: true,
      slug: true,
      featuredImage: true,
      publishedAt: true,
      category: { select: { name: true } },
    },
    orderBy: { publishedAt: "desc" },
    take: 5,
  });

  // Get trending (most viewed)
  const trendingArticles = await prisma.article.findMany({
    where: { status: "PUBLISHED" },
    select: { title: true, slug: true },
    orderBy: { views: "desc" },
    take: 10,
  });

  // Get widget configuration
  const widgetConfig = await getWidgetConfig();

  // Calculate word count for SEO
  const wordCount = article.content.replace(/<[^>]*>/g, "").split(/\s+/).filter(Boolean).length;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://japanpopuler.com";

  return (
    <div className="min-h-screen bg-white text-[#111827]">
      {/* Article JSON-LD for SEO */}
      <ArticleJsonLd
        title={article.title}
        description={article.excerpt || article.metaDescription || article.title}
        url={`${siteUrl}/${article.slug}`}
        image={article.featuredImage || undefined}
        publishedAt={article.publishedAt?.toISOString() || article.createdAt.toISOString()}
        updatedAt={article.updatedAt.toISOString()}
        authorName={article.author.name}
        authorImage={article.author.image || undefined}
        category={article.category.name}
        categorySlug={article.category.slug}
        tags={article.tags.map((t: any) => t.tag.name)}
        wordCount={wordCount}
      />

      {article.status !== "PUBLISHED" && (
        <div className="sticky top-0 z-[60] border-b border-yellow-300 bg-yellow-50 px-4 py-2 text-center text-sm font-bold text-yellow-800">
          ⚠️ Mode Preview — Artikel ini belum dipublikasikan (Status: {article.status})
        </div>
      )}
      <ParallaxAd position="MOBILE_TOP" />
      <StickySiteHeader />

      <main className="mx-auto max-w-6xl px-3 py-6 sm:px-6 sm:py-8 lg:grid lg:grid-cols-[minmax(0,1fr)_310px] lg:gap-8 lg:px-8">
        <article className="min-w-0">
          {/* Breadcrumb */}
          <div className="text-xs font-extrabold sm:font-black">
            <Link href="/" className="text-[#1B5DAF] hover:text-[#2D54A7]">Home</Link>
            <span className="mx-1 text-slate-400">/</span>
            <Link href={`/kategori/${article.category.slug}`} className="text-[#1B5DAF] hover:text-[#2D54A7]">
              {article.category.name}
            </Link>
          </div>

          {/* Title */}
          <h1 className="mt-6 text-[23px] font-extrabold leading-[1.18] tracking-tight text-[#111827] sm:mt-7 sm:text-[34px] sm:font-black sm:leading-[1.12]">
            {article.title}
          </h1>

          {/* Author & share */}
          <div className="mt-5 flex flex-col gap-4 border-b border-slate-200 pb-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3 text-xs text-slate-600">
              <div className="relative h-11 w-11 overflow-hidden rounded-full bg-slate-100 ring-1 ring-slate-200">
                <Image
                  src={article.author.image || "/jepangupdates-logo-trimmed.png"}
                  alt={article.author.name}
                  fill
                  sizes="44px"
                  className={article.author.image ? "object-cover" : "object-contain p-1.5"}
                />
              </div>
              <div>
                <p className="inline-flex flex-wrap items-center gap-1.5 font-bold text-[#1B5DAF]">
                  {article.author.name}
                  <BadgeCheck size={15} className="fill-[#1B5DAF] text-white" aria-label="Penulis terverifikasi" />
                </p>
                <p>{article.publishedAt ? formatDateID(article.publishedAt) : ""}</p>
              </div>
            </div>
            <ArticleShareButtons />
          </div>

          {/* Feature Image */}
          {article.featuredImage && (
            <div className="relative mt-6 aspect-[16/9] overflow-hidden rounded-md bg-slate-100">
              <Image
                src={article.featuredImage}
                alt={article.title}
                fill
                sizes="(min-width: 1024px) 690px, 100vw"
                className="object-cover"
                priority
              />
            </div>
          )}

          {/* Article body */}
          <div className="mt-6 lg:grid lg:grid-cols-[200px_minmax(0,1fr)] lg:gap-6">
            {/* Left sidebar - Related */}
            <aside className="hidden lg:block">
              <div className="sticky top-[120px]">
                <h2 className="border-b-2 border-[#E6372E] pb-2 text-sm font-black uppercase text-black">Berita Terkait</h2>
                <div className="mt-4 space-y-4">
                  {relatedArticles.slice(0, 6).map((item: any) => (
                    <Link href={`/${item.slug}`} className="block text-[13px] font-bold leading-5 text-[#111827] hover:text-[#1B5DAF]" key={item.slug}>
                      {item.title}
                    </Link>
                  ))}
                </div>
              </div>
            </aside>

            {/* Article content */}
            <div className="article-copy overflow-x-auto text-[15px] leading-7 text-[#111827] sm:text-[16px] sm:leading-8">
              <ArticleContentWithAd content={article.content} bacaJuga={relatedArticles.length > 0 ? { title: relatedArticles[0].title, slug: relatedArticles[0].slug } : null} />
            </div>
          </div>

          {/* Tags */}
          {article.tags.length > 0 && (
            <div className="mt-8 border-t border-slate-200 pt-6">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm font-black text-[#111827]">Tag:</span>
                {article.tags.map(({ tag }) => (
                  <Link
                    href={`/search?q=${encodeURIComponent(tag.name)}`}
                    className="rounded-md bg-slate-100 px-3 py-1.5 text-xs font-bold text-[#1B5DAF] transition hover:bg-[#1B5DAF] hover:text-white"
                    key={tag.id}
                  >
                    {tag.name}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Related - mobile */}
          <section className="mt-8 lg:hidden">
            <h2 className="border-b-2 border-[#E6372E] pb-2 text-lg font-black uppercase text-black">Berita Terkait</h2>
            <div className="mt-4 space-y-3">
              {relatedArticles.slice(0, 6).map((item) => (
                <Link href={`/${item.slug}`} className="block border-b border-slate-100 pb-3 text-sm font-bold leading-5 text-[#111827] hover:text-[#1B5DAF]" key={item.slug}>
                  {item.title}
                </Link>
              ))}
            </div>
          </section>

          {/* Latest news below */}
          <section className="mt-10">
            <h2 className="border-b-2 border-[#E6372E] pb-2 text-lg font-black uppercase text-black sm:text-xl">Berita Terbaru</h2>
            <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {latestArticles.map((item) => (
                <Link href={`/${item.slug}`} className="group block" key={item.slug}>
                  {item.featuredImage && (
                    <div className="relative aspect-[16/10] overflow-hidden rounded-md bg-slate-100">
                      <Image src={item.featuredImage} alt={item.title} fill sizes="(min-width: 1024px) 280px, (min-width: 640px) 340px, 100vw" className="object-cover transition group-hover:scale-105" />
                    </div>
                  )}
                  <p className="mt-3 text-[11px] font-extrabold uppercase text-[#E6372E] sm:font-black">{item.category.name}</p>
                  <h3 className="mt-1 line-clamp-2 text-sm font-bold leading-snug text-[#111827] group-hover:text-[#1B5DAF] sm:text-base">{item.title}</h3>
                  <p className="mt-2 text-[11px] text-slate-500">{item.publishedAt ? formatDateID(item.publishedAt) : ""}</p>
                </Link>
              ))}
            </div>
          </section>
        </article>

        {/* Right sidebar */}
        <aside className="hidden lg:block">
          <div className="sticky top-[120px] space-y-9">
            <section>
              <h2 className="border-b-2 border-[#E6372E] pb-2 text-xl font-black uppercase leading-none text-black">Berita Terbaru</h2>
              <div className="mt-5 space-y-5">
                {latestArticles.map((item) => (
                  <Link href={`/${item.slug}`} className="grid grid-cols-[minmax(0,1fr)_116px] items-start gap-3" key={item.slug}>
                    <div className="min-w-0">
                      <p className="text-[13px] font-bold text-[#E6372E]">{item.category.name}</p>
                      <h3 className="mt-2 line-clamp-3 text-[14px] font-bold italic leading-5 text-black hover:text-[#1B5DAF]">{item.title}</h3>
                      <p className="mt-2 text-xs font-medium text-slate-400">{item.publishedAt ? formatDateID(item.publishedAt) : ""}</p>
                    </div>
                    {item.featuredImage && (
                      <div className="relative mt-1 h-[82px] overflow-hidden rounded-lg bg-slate-100">
                        <Image src={item.featuredImage} alt={item.title} fill sizes="116px" className="object-cover" />
                      </div>
                    )}
                  </Link>
                ))}
              </div>
            </section>

            <section>
              <h2 className="border-b-2 border-[#E6372E] pb-2 text-xl font-black uppercase leading-none text-black">Trending</h2>
              <div className="mt-4 space-y-3">
                {isWidgetEnabled(widgetConfig, "trending") && trendingArticles.map((item, index) => (
                  <Link href={`/${item.slug}`} className="grid grid-cols-[48px_1fr] gap-4 bg-[#F7F7F7] p-4 hover:bg-[#F4F7FB]" key={item.slug}>
                    <span className="text-4xl font-bold italic leading-none text-[#1B5DAF]">{index + 1}</span>
                    <span className="text-[13px] font-black leading-5 text-[#111827]">{item.title}</span>
                  </Link>
                ))}
              </div>
            </section>
          </div>
        </aside>
      </main>

      <Footer />
    </div>
  );
}
