import "@seed-design/css/base.layered.min.css";
import "simple-reveal/index.css";
import "./global.css";

import GoogleAnalytics from "@/components/google-analytics";
import { LatestVersionBanner } from "@/components/latest-version-banner";
import { Inter } from "next/font/google";
import type { Viewport } from "next";
import type { ReactNode } from "react";
import ThemeSync from "@/components/theme-sync";

export const viewport: Viewport = {
  // 모바일에서 가상 키보드가 올라올 때 레이아웃 뷰포트를 리사이즈해 AI 패널 입력창이 가려지지 않도록 함
  // Android Chrome 108+에서 동작, iOS Safari는 Visual Viewport API로 처리
  interactiveWidget: "resizes-content",
};

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
