"use client";

import { AstroProvider } from "fumadocs-core/framework/astro";
import type { ReactNode } from "react";
import { PageLink } from "@/components/link";
import { archivePaths } from "@/lib/docs-archive";

/** 전체 페이지 이동. archive 채널에서는 `Link`와 같은 trailing slash 규칙을 따른다. */
function navigate(url: string) {
  window.location.assign(archivePaths.pageHref(url));
}

/** docs island가 쓰는 fumadocs framework context(`usePathname`·`useRouter`·`Link`). */
export function DocsFrameworkProvider({
  pathname,
  children,
}: {
  pathname: string;
  children: ReactNode;
}) {
  return (
    <AstroProvider
      // archive 채널의 주소는 trailing slash로 끝난다. Next.js의 `usePathname()`도 그 형태를 돌려줬다.
      pathname={archivePaths.pageHref(pathname)}
      Link={PageLink}
      navigate={navigate}
    >
      {children}
    </AstroProvider>
  );
}
