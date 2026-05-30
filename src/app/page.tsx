import Image from "next/image";
import Link from "next/link";
import { Footer } from "@/components/Footer";
import { StickySiteHeader } from "@/components/StickySiteHeader";
import { ParallaxAd } from "@/components/ads/ParallaxAd";
import { PrayerTimesWidget } from "@/components/PrayerTimesWidget";
import { WeatherWidget } from "@/components/WeatherWidget";
import { HeadlineCarousel } from "@/components/HeadlineCarousel";
import { SideAds } from "@/components/SideAds";
import { DynamicAd } from "@/components/DynamicAd";
import { LazyLoad } from "@/components/LazyLoad";
import { prisma } from "@/lib/prisma";
import { getWidgetConfig, isWidgetEnabled } from "@/lib/widgets";
import { formatDateID } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [headlineArticles, latestArticles, trendingArticles, categories, musicArticles, jepangArticles, widgetConfig] = await Promise.all([
    prisma.article.findMany({
      where: { status: "PUBLISHED", isHeadline: true },
      include: { category: { select: { name: true, slug: true } } },
      orderBy: { publishedAt: "desc" },
      take: 5,
    }),
    prisma.article.findMany({
      where: { status: "PUBLISHED" },
      include: { category: { select: { name: true, slug: true } }, author: { select: { name: true } } },
      orderBy: { publishedAt: "desc" },
      take: 20,
    }),
    prisma.article.findMany({
      where: { status: "PUBLISHED" },
      select: { title: true, slug: true, featuredImage: true, category: { select: { name: true } } },
      orderBy: { views: "desc" },
      take: 10,
    }),
    prisma.category.findMany({
      where: { isActive: true },
      select: { name: true, slug: true, _count: { select: { articles: true } } },
      orderBy: { articles: { _count: "desc" } },
    }),
    prisma.article.findMany({
      where: { status: "PUBLISHED", category: { slug: "music" } },
      select: { title: true, slug: true, featuredImage: true, category: { select: { name: true } } },
      orderBy: { publishedAt: "desc" },
      take: 6,
    }),
    prisma.article.findMany({
      where: { status: "PUBLISHED", category: { slug: "jepang" } },
      select: { title: true, slug: true, featuredImage: true, category: { select: { name: true } } },
      orderBy: { publishedAt: "desc" },
      take: 6,
    }),
    getWidgetConfig(),
  ]);

  // Use headline articles or fallback to first 4 latest
  const carouselItems = headlineArticles.length > 0 ? headlineArticles : latestArticles.slice(0, 4);

  return (
    <div className="min-h-screen bg-white text-[#111827]">
      <ParallaxAd position="MOBILE_TOP" />
      <StickySiteHeader />
      <TopAdvertisement />

      <main className="mx-auto grid max-w-6xl gap-8 px-3 py-3 sm:px-6 lg:grid-cols-[minmax(0,1fr)_280px] lg:px-8 xl:relative">
        <div className="min-w-0">
          {latestArticles.length === 0 ? (
            <div className="mt-8 rounded-lg border border-dashed border-slate-300 p-12 text-center">
              <p className="text-lg font-bold text-slate-500">Belum ada artikel</p>
              <p className="mt-2 text-sm text-slate-400">Tulis artikel pertama dari dashboard admin</p>
              <Link href="/admin/articles/new" className="mt-4 inline-block rounded-md bg-[#1B5DAF] px-5 py-2.5 text-sm font-bold text-white">Tulis Artikel</Link>
            </div>
          ) : (
            <>
              {/* Headline Carousel */}
              {carouselItems.length > 0 && (
                <section className="mt-4">
                  <HeadlineCarousel items={carouselItems.map(item => ({
                    category: item.category.name,
                    title: item.title,
                    image: item.featuredImage || "/jepangupdates-logo.png",
                    date: item.publishedAt ? formatDateID(item.publishedAt) : "",
                    slug: item.slug,
                  }))} />
                </section>
              )}

              {/* Jepang Section - horizontal scroll */}
              {jepangArticles.length > 0 && (
                <section className="mt-8">
                  <div className="flex items-center justify-between">
                    <SectionTitle title="Jepang" />
                    <Link href="/kategori/jepang" className="text-xs font-bold text-[#1B5DAF] hover:underline">Lihat Semua →</Link>
                  </div>
                  <div className="mt-5 flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                    {jepangArticles.map((item) => (
                      <Link href={`/${item.slug}`} key={item.slug} className="group block w-[260px] flex-shrink-0 sm:w-[300px]">
                        <div className="relative aspect-[16/10] overflow-hidden rounded-lg bg-slate-100">
                          {item.featuredImage ? (
                            <Image src={item.featuredImage} alt={item.title} fill sizes="300px" className="object-cover transition group-hover:scale-105" />
                          ) : (
                            <div className="flex h-full items-center justify-center bg-gradient-to-br from-[#1B5DAF] to-[#0f3b8c] text-xs text-white/60">Jepang</div>
                          )}
                        </div>
                        <p className="mt-2 text-[10px] font-black uppercase text-[#E6372E]">{item.category.name}</p>
                        <h3 className="mt-1 line-clamp-2 text-sm font-bold leading-snug text-[#111827] group-hover:text-[#1B5DAF]">{item.title}</h3>
                      </Link>
                    ))}
                  </div>
                </section>
              )}

              {/* Berita Terkini - 5 items */}
              <section className="mt-8">
                <SectionTitle title="Berita Terkini" />
                <div className="mt-5 space-y-6">
                  {latestArticles.slice(0, 5).map((article) => (
                    <ArticleListItem key={article.id} article={article} />
                  ))}
                </div>
              </section>

              {/* Music Section */}
              {musicArticles.length > 0 && (
                <section className="mt-8">
                  <SectionTitle title="Music" />
                  <div className="mt-5 overflow-hidden rounded-lg bg-[#07182C]">
                    <div className="flex gap-3 overflow-x-auto p-3 md:grid md:grid-cols-3 md:gap-0 md:p-0">
                      {musicArticles.slice(0, 3).map((item) => (
                        <Link href={`/${item.slug}`} key={item.slug} className="group relative block w-[200px] flex-shrink-0 overflow-hidden rounded-md md:w-auto md:rounded-none">
                          <div className="relative aspect-[3/4] md:aspect-[4/3]">
                            {item.featuredImage ? (
                              <Image src={item.featuredImage} alt={item.title} fill sizes="(min-width: 768px) 300px, 200px" className="object-cover opacity-90 transition group-hover:scale-105 group-hover:opacity-100" />
                            ) : (
                              <div className="h-full bg-gradient-to-br from-slate-700 to-slate-900" />
                            )}
                            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-3 md:hidden">
                              <h3 className="line-clamp-2 text-[12px] font-bold leading-tight text-white">{item.title}</h3>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                    <div className="hidden divide-x divide-white/10 md:grid md:grid-cols-3">
                      {musicArticles.slice(0, 3).map((item) => (
                        <Link href={`/${item.slug}`} key={`text-${item.slug}`} className="group block px-4 py-4">
                          <p className="text-[11px] font-black uppercase text-[#E6372E]">{item.category.name}</p>
                          <h3 className="mt-1.5 line-clamp-3 text-[14px] font-bold leading-snug text-white group-hover:text-[#F5A91B]">{item.title}</h3>
                        </Link>
                      ))}
                    </div>
                  </div>
                </section>
              )}

              {/* Artikel Populer - grid */}
              {latestArticles.length > 5 && (
                <section className="mt-8">
                  <SectionTitle title="Artikel Populer" />
                  <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {latestArticles.slice(5, 11).map((article) => (
                      <Link href={`/${article.slug}`} key={article.id} className="group block">
                        <div className="relative aspect-[16/10] overflow-hidden rounded-md bg-slate-100">
                          {article.featuredImage ? (
                            <Image src={article.featuredImage} alt={article.title} fill sizes="(min-width: 1024px) 250px, (min-width: 640px) 340px, 100vw" className="object-cover transition group-hover:scale-105" />
                          ) : (
                            <div className="flex h-full items-center justify-center text-xs text-slate-400">No image</div>
                          )}
                        </div>
                        <p className="mt-3 text-[10px] font-black uppercase text-[#E6372E]">{article.category.name}</p>
                        <h3 className="mt-1 line-clamp-2 text-sm font-bold leading-snug text-[#111827] group-hover:text-[#1B5DAF]">{article.title}</h3>
                        <p className="mt-2 text-[10px] text-slate-500">{article.publishedAt ? formatDateID(article.publishedAt) : ""}</p>
                      </Link>
                    ))}
                  </div>
                </section>
              )}

              <InlineAd />

              {/* Berita lanjutan */}
              {latestArticles.length > 11 && (
                <section className="mt-8">
                  <SectionTitle title="Berita Terbaru" />
                  <div className="mt-5 space-y-6">
                    {latestArticles.slice(11, 15).map((article) => (
                      <ArticleListItem key={article.id} article={article} />
                    ))}
                  </div>
                </section>
              )}

              {/* Pagination - di paling bawah */}
              <Pagination />
            </>
          )}
        </div>

        {/* Sidebar */}
        <aside className="space-y-8">
          {isWidgetEnabled(widgetConfig, "trending") && (
            <section>
              <h2 className="border-b-2 border-[#E6372E] pb-2 text-xl font-black uppercase text-[#111827]">Trending</h2>
              <div className="mt-4 space-y-3">
                {trendingArticles.length === 0 ? (
                  <p className="py-4 text-sm text-slate-400">Belum ada data trending</p>
                ) : (
                  trendingArticles.map((item, index) => (
                    <Link href={`/${item.slug}`} className="grid grid-cols-[48px_1fr] gap-4 bg-[#F7F7F7] p-4 hover:bg-[#F4F7FB]" key={item.slug}>
                      <span className="text-4xl font-bold italic leading-none text-[#1B5DAF]">{index + 1}</span>
                      <span className="text-[13px] font-black leading-5 text-[#111827]">{item.title}</span>
                    </Link>
                  ))
                )}
              </div>
            </section>
          )}

          <section>
            <h2 className="border-b-2 border-[#E6372E] pb-2 text-xl font-black uppercase text-[#111827]">Hot Topic</h2>
            <div className="mt-4 space-y-2">
              {categories.slice(0, 5).map((cat) => (
                <Link href={`/kategori/${cat.slug}`} className="flex items-center justify-between rounded-md px-3 py-2.5 text-sm font-bold text-[#111827] transition hover:bg-[#FEF2F2] hover:text-[#E6372E]" key={cat.slug}>
                  <span className="flex items-center gap-2">
                    <span className="text-[#E6372E] font-black">#</span>
                    {cat.name}
                  </span>
                  <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-bold text-slate-500">{cat._count.articles}</span>
                </Link>
              ))}
            </div>
          </section>

          {isWidgetEnabled(widgetConfig, "weather") && (
            <LazyLoad>
              <section>
                <h2 className="border-b-2 border-[#E6372E] pb-2 text-xl font-black uppercase text-[#111827]">Cuaca Jepang</h2>
                <WeatherWidget />
              </section>
            </LazyLoad>
          )}

          {isWidgetEnabled(widgetConfig, "prayer_times") && (
            <LazyLoad>
              <section>
                <h2 className="border-b-2 border-[#E6372E] pb-2 text-xl font-black uppercase text-[#111827]">Jadwal Sholat</h2>
                <PrayerTimesWidget />
              </section>
            </LazyLoad>
          )}

          <section>
            <h2 className="border-b-2 border-[#E6372E] pb-2 text-xl font-black uppercase text-[#111827]">Advertising</h2>
            <div className="mt-4">
              <DynamicAd position="SIDEBAR_TOP" fallback={null} />
            </div>
          </section>

          {/* Dynamic layout widgets for sidebar */}
        </aside>
      </main>

      <Footer />
    </div>
  );
}

function TopAdvertisement() {
  return <DynamicAd position="HEADER_BANNER" fallback={null} />;
}

function InlineAd() {
  return <DynamicAd position="ARTICLE_TOP" fallback={null} />;
}

function SectionTitle({ title }: { title: string }) {
  return <h2 className="border-b-2 border-[#E6372E] pb-2 text-lg font-extrabold uppercase text-[#111827] sm:text-xl sm:font-black">{title}</h2>;
}

function Pagination() {
  return (
    <nav className="mt-8 flex items-center justify-center gap-2" aria-label="Pagination">
      <span className="flex h-10 w-10 items-center justify-center rounded-md bg-[#1B5DAF] text-sm font-bold text-white">1</span>
      <Link href="/?page=2" className="flex h-10 w-10 items-center justify-center rounded-md bg-slate-100 text-sm font-bold text-[#111827] transition hover:bg-[#1B5DAF] hover:text-white">2</Link>
      <Link href="/?page=3" className="flex h-10 w-10 items-center justify-center rounded-md bg-slate-100 text-sm font-bold text-[#111827] transition hover:bg-[#1B5DAF] hover:text-white">3</Link>
      <span className="px-1 text-slate-400">...</span>
      <Link href="/?page=2" className="flex h-10 items-center justify-center rounded-md bg-[#1B5DAF] px-4 text-sm font-bold text-white transition hover:bg-[#164a8a]">Selanjutnya →</Link>
    </nav>
  );
}

type ArticleData = {
  id: string;
  title: string;
  slug: string;
  featuredImage: string | null;
  publishedAt: Date | null;
  category: { name: string; slug: string };
  author: { name: string };
};

function ArticleListItem({ article }: { article: ArticleData }) {
  return (
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
  );
}
