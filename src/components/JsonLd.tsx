type ArticleJsonLdProps = {
  title: string;
  description: string;
  url: string;
  image?: string;
  publishedAt: string;
  updatedAt?: string;
  authorName: string;
  category: string;
};

export function ArticleJsonLd({
  title,
  description,
  url,
  image,
  publishedAt,
  updatedAt,
  authorName,
  category,
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
    author: {
      "@type": "Person",
      name: authorName,
    },
    publisher: {
      "@type": "Organization",
      name: "Jepang Updates",
      logo: {
        "@type": "ImageObject",
        url: "https://jepangupdates.com/jepangupdates-logo.png",
      },
    },
    articleSection: category,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export function WebsiteJsonLd() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Jepang Updates",
    url: "https://jepangupdates.com",
    description: "Portal berita komunitas Indonesia di Jepang",
    publisher: {
      "@type": "Organization",
      name: "Jepang Updates",
      logo: {
        "@type": "ImageObject",
        url: "https://jepangupdates.com/jepangupdates-logo.png",
      },
    },
    potentialAction: {
      "@type": "SearchAction",
      target: "https://jepangupdates.com/search?q={search_term_string}",
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
