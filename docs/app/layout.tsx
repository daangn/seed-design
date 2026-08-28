import "./layer-order.css";
import "@seed-design/css/base.layered.min.css";
import "simple-reveal/index.css";
import "./global.css";

import GoogleAnalytics from "@/components/google-analytics";
import { LatestVersionBanner } from "@/components/latest-version-banner";
import { SiteAnnouncementBanner } from "@/components/site-announcement-banner";
import { type ReactNode, Suspense } from "react";
import ThemeSync from "@/components/theme-sync";
import { RecentPagesRecorder } from "@/components/recent-pages-recorder";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { buildSeoMetadata } from "@/lib/seo";

// Site-wide default: metadataBase + default Open Graph / Twitter card (the SEED
// brand card). Individual pages may override title/description/image via
// buildSeoMetadata in their own generateMetadata.
export const metadata = buildSeoMetadata();

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="ko"
      data-seed
      data-seed-user-color-scheme="light"
      data-seed-color-mode="system"
      suppressHydrationWarning
    >
      <head>
        <meta name="color-scheme" content="light dark" />
        <link rel="icon" href="/favicon.ico" sizes="32x32" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
        {/* Pretendard (dynamic-subset variable weight 100–900). Rebrand PoC font,
            served from jsDelivr for now — self-host before daangn/prod. Applied as the
            base font-family in app/global.css. */}
        <link rel="preconnect" href="https://cdn.jsdelivr.net" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.css"
        />
        <GoogleAnalytics GA_MEASUREMENT_ID="G-02SS22W02G" />
      </head>
      <body>
        <LatestVersionBanner />
        <ThemeSync />
        <Suspense fallback={null}>
          <RecentPagesRecorder />
        </Suspense>
        <NuqsAdapter>{children}</NuqsAdapter>
        <SiteAnnouncementBanner />
      </body>
    </html>
  );
}
