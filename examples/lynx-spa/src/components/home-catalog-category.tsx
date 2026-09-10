import { useCallback } from "@lynx-js/react";
import { Box, Chip } from "@seed-design/lynx-react";
import type { HomeCategory } from "../pages/home-navigation.js";

interface HomeCatalogCategoryProps {
  category: HomeCategory;
  onCategoryChange: (category: HomeCategory) => void;
}

export function HomeCatalogCategory({ category, onCategoryChange }: HomeCatalogCategoryProps) {
  const handleCategoryChange = useCallback(
    (value: string) => {
      "background only";
      if (value === "docs" || value === "playground" || value === "tools") {
        onCategoryChange(value);
      }
    },
    [onCategoryChange],
  );

  return (
    <Box px="x4" pt="x2">
      <scroll-view scroll-orientation="horizontal" className="w-full">
        <Chip.RadioRoot
          value={category}
          onValueChange={handleCategoryChange}
          className="flex flex-row gap-x2"
        >
          <Chip.RadioItem value="docs" accessibility-label="문서 예제">
            <Chip.Label>문서 예제</Chip.Label>
          </Chip.RadioItem>
          <Chip.RadioItem value="playground" accessibility-label="플레이그라운드">
            <Chip.Label>플레이그라운드</Chip.Label>
          </Chip.RadioItem>
          <Chip.RadioItem value="tools" accessibility-label="개발 도구">
            <Chip.Label>개발 도구</Chip.Label>
          </Chip.RadioItem>
        </Chip.RadioRoot>
      </scroll-view>
    </Box>
  );
}
