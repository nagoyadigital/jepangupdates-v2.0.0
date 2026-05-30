import Script from "next/script";
import { getSeoConfig } from "@/lib/seo";

/**
 * Server component that injects SEO verification meta tags,
 * Google Analytics, and custom head/body scripts.
 * Uses next/script for non-blocking loading of analytics.
 */
export async function SeoHead() {
  const seo = await getSeoConfig();

  return (
    <>
      {/* Verification meta tags */}
      {seo.google_verification && (
        <meta name="google-site-verification" content={seo.google_verification} />
      )}
      {seo.bing_verification && (
        <meta name="msvalidate.01" content={seo.bing_verification} />
      )}
      {seo.yandex_verification && (
        <meta name="yandex-verification" content={seo.yandex_verification} />
      )}
      {seo.pinterest_verification && (
        <meta name="p:domain_verify" content={seo.pinterest_verification} />
      )}

      {/* Google Analytics - loaded after page interactive */}
      {seo.google_analytics_id && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${seo.google_analytics_id}`}
            strategy="afterInteractive"
          />
          <Script id="ga-config" strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${seo.google_analytics_id}');`}
          </Script>
        </>
      )}

      {/* Google Tag Manager - loaded after page interactive */}
      {seo.gtm_id && (
        <Script id="gtm-script" strategy="afterInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${seo.gtm_id}');`}
        </Script>
      )}

      {/* Custom head scripts */}
      {seo.head_scripts && (
        <Script id="custom-head" strategy="afterInteractive">
          {seo.head_scripts}
        </Script>
      )}
    </>
  );
}

export async function SeoBodyScripts() {
  const seo = await getSeoConfig();

  return (
    <>
      {/* GTM noscript */}
      {seo.gtm_id && (
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${seo.gtm_id}`}
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
      )}

      {/* Custom body scripts */}
      {seo.body_scripts && (
        <script dangerouslySetInnerHTML={{ __html: seo.body_scripts }} />
      )}
    </>
  );
}
