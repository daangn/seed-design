import { RootProvider } from "fumadocs-ui/provider/astro";
import { LandingExperience } from "@/components/landing/landing-experience";
import { LandingSearchDialog } from "@/components/search/search";
import { TAGS } from "@/lib/search-tags";

/**
 * 랜딩 페이지 island. 랜딩은 docs 레이아웃 밖이라 헤더의 검색 버튼이 쓸 search context를 여기서
 * 직접 둔다. 테마는 끈다 — 랜딩은 next-themes가 아니라 seed의 data-attribute 색 구성을 쓴다.
 */
export function LandingPage() {
  return (
    <RootProvider
      pathname="/"
      theme={{ enabled: false }}
      search={{
        SearchDialog: LandingSearchDialog,
        options: {
          tags: Object.values(TAGS),
        },
      }}
    >
      <LandingExperience />
    </RootProvider>
  );
}
