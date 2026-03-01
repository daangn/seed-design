import "@seed-design/css/all.min.css";
import "simple-reveal/index.css";
import "./global.css";

import GoogleAnalytics from "@/components/google-analytics";
import { LatestVersionBanner } from "@/components/latest-version-banner";
import { Inter } from "next/font/google";
import type { ReactNode } from "react";
import ThemeSync from "@/components/theme-sync";

const inter = Inter({
  subsets: ["latin"],
});

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="ko"
      className={inter.className}
      data-seed
      data-seed-user-color-scheme="light"
      data-seed-color-mode="system"
      suppressHydrationWarning
    >
      <head>
        <meta name="color-scheme" content="light dark" />
        <link rel="icon" href="/favicon.svg" />
        <GoogleAnalytics GA_MEASUREMENT_ID="G-02SS22W02G" />
      </head>
      <body>
        <LatestVersionBanner />
        <ThemeSync />
        {children}
      </body>
    </html>
  );
}
