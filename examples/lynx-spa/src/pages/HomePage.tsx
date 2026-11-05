import { VStack } from "@seed-design/lynx-react";
import type { LynxPlaygroundExample } from "../../../../docs/playground/lynx/types";
import { HomeCatalogCategory } from "../components/home-catalog-category.js";
import { HomeCatalogContent } from "../components/home-catalog-content.js";
import {
  PLAYGROUND_SECTIONS,
  TOOL_SECTIONS,
  type HomeCategory,
  type LegacyPage,
} from "./home-navigation.js";

interface HomePageProps {
  category: HomeCategory;
  examples: readonly LynxPlaygroundExample[];
  catalogIsEmpty: boolean;
  onCategoryChange: (category: HomeCategory) => void;
  onOpenComponent: (component: string) => void;
  onOpenLegacy: (page: LegacyPage) => void;
}

export function HomePage({
  category,
  examples,
  catalogIsEmpty,
  onCategoryChange,
  onOpenComponent,
  onOpenLegacy,
}: HomePageProps) {
  const legacySections =
    category === "docs"
      ? []
      : (category === "playground" ? PLAYGROUND_SECTIONS : TOOL_SECTIONS)
          .map((section) => ({
            ...section,
            items: section.items.filter((item) => `${item.title} ${item.page}`.toLowerCase()),
          }))
          .filter((section) => section.items.length > 0);

  return (
    <VStack className="flex-1 min-h-0" bg="bg.layerBasement">
      <scroll-view scroll-orientation="vertical" className="flex-1 min-h-0">
        <HomeCatalogCategory category={category} onCategoryChange={onCategoryChange} />
        <HomeCatalogContent
          category={category}
          examples={examples}
          catalogIsEmpty={catalogIsEmpty}
          legacySections={legacySections}
          onOpenComponent={onOpenComponent}
          onOpenLegacy={onOpenLegacy}
        />
      </scroll-view>
    </VStack>
  );
}
