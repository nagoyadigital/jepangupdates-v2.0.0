import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Footer } from "@/components/Footer";
import { StickySiteHeader } from "@/components/StickySiteHeader";
import { ParallaxAd } from "@/components/ads/ParallaxAd";
import { SideAds } from "@/components/SideAds";
import { DynamicAd } from "@/components/DynamicAd";
import { PrayerTimesWidget } from "@/components/PrayerTimesWidget";
import { WeatherWidget } from "@/components/WeatherWidget";
import { CategoryBreadcrumbJsonLd } from "@/components/JsonLd";
import { getWidgetConfig, isWidgetEnabled } from "@/lib/widgets";
import { formatDateID } from "@/lib/utils";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";
export const revalidate = 60; // ISR: revalidate every 60 seconds

type PageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = await prisma.category.findUnique({ where: { slug }, select: { name: true, metaTitle: true, metaDescription: true } });
  if (!category) return {};
  return {
    title: category.metaTitle || category.name,
    description: category.metaDescription || `Artikel kategori ${category.name} di Jepang Updates`,
  };
}

export default async function CategoryPage({ params }: PageProps) {
  const { slug } = await params;

  const category = await prisma.category.findUnique({ where: { slug } });
  if (!category) notFound();

  const [articles, trendingArticles, widgetConfig] = await Promise.all([
    prisma.article.findMany({
      where: { status: "PUBLISHED", categoryId: category.id },
      include: { author: { select: { name: true } }, category: { select: { name: true, slug: true } } },
      orderBy: { publishedAt: "desc" },
      take: 20,
    }),
    prisma.article.findMany({
      where: { status: "PUBLISHED" },
      select: { title: true, slug: true },
      orderBy: { views: "desc" },
      take: 10,
    }),
    getWidgetConfig(),
  ]);

  return (
    <div className="min-h-screen bg-white text-[#111827]">
      <CategoryBreadcrumbJsonLd name={category.name} slug={slug} />
      <ParallaxAd position="MOBILE_TOP" />
      <StickySiteHeader />

      {/* Header Ad */}
      <DynamicAd position="HEADER_BANNER" fallback={null} />

      <main className="mx-auto grid max-w-6xl gap-8 px-3 py-6 sm:px-6 lg:grid-cols-[minmax(0,1fr)_280px] lg:px-8">
        {/* Main content */}
        <div className="min-w-0">
          <div className="text-xs font-black">
            <Link href="/" className="text-[#1B5DAF]">Home</Link>
            <span className="mx-1 text-slate-400">/</span>
            <span className="text-slate-600">{category.name}</span>
          </div>

          <h1 className="mt-4 text-3xl font-black text-[#111827]">{category.name}</h1>
          {category.description && <p className="mt-2 text-sm text-slate-500">{category.description}</p>}

          {articles.length === 0 ? (
            <p className="mt-8 text-center text-slate-400">Belum ada artikel di kategori ini</p>
          ) : (
            <div className="mt-8 space-y-7">
              {articles.map((article, idx) => (
                <div key={article.id}>
                  <Link href={`/${article.slug}`} className="grid grid-cols-[120px_minmax(0,1fr)] items-start gap-3 sm:grid-cols-[220px_minmax(0,1fr)] sm:gap-4">
                    <div className="relative h-[90px] overflow-hidden rounded-md bg-slate-100 sm:aspect-[16/10] sm:h-auto">
                      {article.featuredImage ? (
                        <Image src={article.featuredImage} alt={article.title} fill sizes="(min-width: 640px) 220px, 120px" className="object-cover transition hover:scale-105" />
                      ) : (
                        <div className="flex h-full items-center justify-center text-xs text-slate-400">No image</div>
                      )}
                    </div>
                    <div className="pt-1">
                      <p className="text-[10px] font-extrabold uppercase text-red-600 sm:text-[11px] sm:font-black">{article.category.name}</p>
                      <h3 className="mt-1 line-clamp-3 text-[14px] font-bold leading-snug text-[#111827] hover:text-[#1B5DAF] sm:mt-2 sm:text-xl sm:font-black sm:leading-tight">{article.title}</h3>
                      <p className="mt-1 text-[10px] text-slate-500 sm:mt-2 sm:text-xs">{article.publishedAt ? formatDateID(article.publishedAt) : ""}</p>
                    </div>
                  </Link>
                  {/* Inline ad after every 5 articles */}
                  {(idx + 1) % 5 === 0 && idx < articles.length - 1 && (
                    <div className="mt-7">
                      <DynamicAd position="ARTICLE_TOP" fallback={null} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <aside className="hidden lg:block">
          <div className="sticky top-[120px] space-y-8">
            {/* Sidebar Ad */}
            <DynamicAd position="SIDEBAR_TOP" fallback={null} />

            {/* Trending */}
            {isWidgetEnabled(widgetConfig, "trending") && (
              <section>
                <h2 className="border-b-2 border-[#E6372E] pb-2 text-xl font-black uppercase text-[#111827]">Trending</h2>
                <div className="mt-4 space-y-3">
                  {trendingArticles.map((item, index) => (
                    <Link href={`/${item.slug}`} className="grid grid-cols-[48px_1fr] gap-4 bg-[#F7F7F7] p-4 hover:bg-[#F4F7FB]" key={item.slug}>
                      <span className="text-4xl font-bold italic leading-none text-[#1B5DAF]">{index + 1}</span>
                      <span className="text-[13px] font-black leading-5 text-[#111827]">{item.title}</span>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {/* Weather */}
            {isWidgetEnabled(widgetConfig, "weather") && (
              <section>
                <h2 className="border-b-2 border-[#E6372E] pb-2 text-xl font-black uppercase text-[#111827]">Cuaca Jepang</h2>
                <WeatherWidget />
              </section>
            )}

            {/* Prayer Times */}
            {isWidgetEnabled(widgetConfig, "prayer_times") && (
              <section>
                <h2 className="border-b-2 border-[#E6372E] pb-2 text-xl font-black uppercase text-[#111827]">Jadwal Sholat</h2>
                <PrayerTimesWidget />
              </section>
            )}
          </div>
        </aside>
      </main>

      {/* Desktop side ads */}
      <SideAds />

      <Footer />
    </div>
  );
}
