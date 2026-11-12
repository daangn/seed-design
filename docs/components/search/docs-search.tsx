"use client";

import type { TagItem } from "fumadocs-ui/contexts/search";
import { lazy, Suspense, useEffect, useState } from "react";
import { searchOpenStore } from "@/components/header/open-stores";
import { DocsFrameworkProvider } from "@/components/layout/docs-framework-provider";

const loadSearchDialog = () => import("./search");
const SearchDialog = lazy(loadSearchDialog);

/**
 * 문서 페이지의 검색 island. Cmd/Ctrl+K와 열림 store만 바로 hydrate하고, 검색 창은 idle 때 미리 받아 두었다가
 * 그린다. idle 전에 열면 그때 불러온다. 서버에서는 아무것도 그리지 않는다(`client:only`).
 */
export function DocsSearch({
  pathname,
  defaultTag,
  tags,
}: {
  pathname: string;
  /** 검색 창이 처음 고르는 섹션 태그. */
  defaultTag?: string;
  tags: TagItem[];
}) {
  const open = searchOpenStore.useOpen();
  // 한 번 그리기 시작한 검색 창은 닫힌 뒤에도 남겨 둔다(닫힘 애니메이션·입력 상태 유지).
  const [mounted, setMounted] = useState(false);
  if (open && !mounted) setMounted(true);

  useEffect(() => {
    const preload = () => {
      void loadSearchDialog().then(() => setMounted(true));
    };
    if ("requestIdleCallback" in window) {
      const id = requestIdleCallback(preload);
      return () => cancelIdleCallback(id);
    }
    const id = setTimeout(preload, 200);
    return () => clearTimeout(id);
  }, []);

  // fumadocs `SearchProvider`의 단축키와 같은 조건이다.
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.defaultPrevented || event.isComposing || event.keyCode === 229) return;
      if (!(event.metaKey || event.ctrlKey) || event.key !== "k") return;
      searchOpenStore.set((value) => !value);
      event.preventDefault();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  if (!mounted) return null;

  return (
    <DocsFrameworkProvider pathname={pathname}>
      <Suspense fallback={null}>
        <SearchDialog
          open={open}
          onOpenChange={searchOpenStore.set}
          {...(defaultTag ? { defaultTag } : {})}
          tags={tags}
        />
      </Suspense>
    </DocsFrameworkProvider>
  );
}
