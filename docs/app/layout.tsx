"use client";

import "./global.css";
import "@seed-design/stylesheet/global.css";
import "@seed-design/stylesheet/token.css";
import { RootProvider } from "fumadocs-ui/provider";
import { Inter } from "next/font/google";
import type { ReactNode } from "react";

const inter = Inter({
  subsets: ["latin"],
});

const SearchDialog = () => <></>; // Temporal no-op component

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      className={inter.className}
      data-seed
      data-seed-scale-color="light"
      suppressHydrationWarning
    >
      <head>
        <meta name="color-scheme" content="light dark" />
      </head>
      <body>
        <RootProvider
          search={{
            SearchDialog,
          }}
        >
          {children}
        </RootProvider>
      </body>
    </html>
  );
}
