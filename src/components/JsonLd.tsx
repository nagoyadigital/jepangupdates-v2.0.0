const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://japanpopuler.com";
const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME || "Japan Populer";
const LOGO_URL = `${SITE_URL}/japanpopuler-logo.png`;

type ArticleJsonLdProps = {
  title: string;
  description: string;
  url: string;
  image?: string;
  publishedAt: string;
  updatedAt?: string;
  authorName: string;
  authorImage?: string;
  category: string;
  categorySlug: string;
  tags?: string[];
  wordCount?: number;
};

export function ArticleJsonLd({
  title,
  description,
  url,
  image,
  publishedAt,
  updatedAt,
  authorName,
  authorImage,
  category,
  categorySlug,
  tags,
  wordCount,
}: ArticleJsonLdProps) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: title,
    description,
    url,
    ...(image ? { image: [image] } : {}),
    datePublished: publishedAt,
    dateModified: updatedAt || publishedAt,
    ...(wordCount ? { wordCount } : {}),
    author: {
      "@type": "Person",
      name: authorName,
      ...(authorImage ? { image: authorImage } : {}),
      url: SITE_URL,
    },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      logo: { "@type": "ImageObject", url: LOGO_URL, width: 600, height: 60 },
    },
    articleSection: category,
    ...(tags && tags.length > 0 ? { keywords: tags.join(", ") } : {}),
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    isAccessibleForFree: true,
    inLanguage: "id-ID",
  };

  // Breadcrumb for article
  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: category, item: `${SITE_URL}/kategori/${categorySlug}` },
      { "@type": "ListItem", position: 3, name: title },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
    </>
  );
}

export function WebsiteJsonLd() {
  const website = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    alternateName: "Japan Populer - Portal Berita Indonesia di Jepang",
    url: SITE_URL,
    description: "Portal berita komunitas Indonesia di Jepang. Informasi terkini seputar pekerjaan, imigrasi, event, dan kehidupan di Jepang.",
    inLanguage: "id-ID",
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      logo: { "@type": "ImageObject", url: LOGO_URL, width: 600, height: 60 },
    },
    potentialAction: {
      "@type": "SearchAction",
      target: { "@type": "EntryPoint", urlTemplate: `${SITE_URL}/search?q={search_term_string}` },
      "query-input": "required name=search_term_string",
    },
  };

  const organization = {
    "@context": "https://schema.org",
    "@type": "NewsMediaOrganization",
    name: SITE_NAME,
    url: SITE_URL,
    logo: { "@type": "ImageObject", url: LOGO_URL, width: 600, height: 60 },
    sameAs: [
      "https://facebook.com/japanpopuler",
      "https://instagram.com/japanpopuler",
      "https://youtube.com/@japanpopuler",
      "https://tiktok.com/@japanpopuler",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      email: "redaksi@japanpopuler.com",
      availableLanguage: ["Indonesian", "Japanese"],
    },
    foundingDate: "2024",
    areaServed: { "@type": "Country", name: "Japan" },
    publishingPrinciples: `${SITE_URL}/pedoman-media-siber`,
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(website) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organization) }} />
    </>
  );
}

export function CategoryBreadcrumbJsonLd({ name, slug }: { name: string; slug: string }) {
  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name, item: `${SITE_URL}/kategori/${slug}` },
    ],
  };

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />;
}
