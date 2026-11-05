import preview from "../.storybook/preview";
import { Text, VStack } from "@seed-design/react";
import { Pagination } from "seed-design/ui/pagination";

import { SeedThemeDecorator } from "./components/decorator";
import { VISUAL_VIEWPORT_PARAMETERS, withVisualTestParameters } from "./utils/parameters";

const meta = preview.meta({
  component: Pagination,
  decorators: [SeedThemeDecorator],
});

const pageCases = [
  ["처음", 1],
  ["앞쪽", 3],
  ["중간", 5],
  ["뒤쪽", 8],
  ["마지막", 10],
] as const;

const CommonStoryTemplate = meta.story({
  args: { totalPages: 10 },
  render: (_, { component }) => {
    const Component = component!;

    return (
      <VStack gap="x4" align="flex-start">
        {pageCases.map(([label, page]) => (
          <VStack key={label} gap="x1" align="flex-start">
            <Text textStyle="t3Regular" color="fg.neutralMuted">
              {label}
            </Text>
            <Component totalPages={10} defaultPage={page} aria-label={`${label} 페이지 예시`} />
          </VStack>
        ))}
        <VStack gap="x1" align="flex-start">
          <Text textStyle="t3Regular" color="fg.neutralMuted">
            비활성
          </Text>
          <Component totalPages={10} defaultPage={5} disabled aria-label="비활성 페이지 예시" />
        </VStack>
      </VStack>
    );
  },
});

export const LightTheme = CommonStoryTemplate.extend({
  parameters: VISUAL_VIEWPORT_PARAMETERS,
});

export const DarkTheme = CommonStoryTemplate.extend({
  parameters: withVisualTestParameters({ theme: "dark" }),
});

export const FontScalingExtraSmall = CommonStoryTemplate.extend({
  parameters: withVisualTestParameters({ fontScale: "Extra Small" }),
});

export const FontScalingExtraExtraExtraLarge = CommonStoryTemplate.extend({
  parameters: withVisualTestParameters({ fontScale: "Extra Extra Extra Large" }),
});

export const WithoutEllipsis = meta.story({
  args: {
    totalPages: 5,
    defaultPage: 3,
    "aria-label": "생략 표시가 없는 페이지 예시",
  },
  parameters: VISUAL_VIEWPORT_PARAMETERS,
});

export const LongPageNumbers = meta.story({
  args: { totalPages: 1_000_000 },
  render: (_, { component }) => {
    const Component = component!;

    return (
      <Component totalPages={1_000_000} defaultPage={500_000} aria-label="긴 페이지 번호 예시" />
    );
  },
  parameters: withVisualTestParameters({}),
});
