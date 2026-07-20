import type { Metadata } from "next";
import { RootProvider } from "fumadocs-ui/provider/next";
import { TAGS } from "@/app/api/search/constants";
import { LandingSearchDialog } from "@/components/search/search";
import { LandingExperience } from "@/components/landing/landing-experience";
import { buildSeoMetadata } from "@/lib/seo";

export default function HomePage() {
  // Landing sits outside the docs RootProvider, so mount our own here to give the
  // header's search button a search context. Theme is off — the landing uses
  // seed's data-attribute color scheme, not next-themes.
  return (
    <RootProvider
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

export function generateMetadata(): Metadata {
  return buildSeoMetadata({
    title: "SEED Design System",
    description: "SEED는 당근 제품을 위한 통합된 디자인 언어입니다.",
  });
}
