import preview from "../.storybook/preview";
import { Text, VStack } from "@seed-design/react";
import { TablePagination } from "seed-design/ui/table-pagination";

import { SeedThemeDecorator } from "./components/decorator";
import { withChromaticParameters } from "./utils/parameters";

const meta = preview.meta({
  component: TablePagination,
  decorators: [SeedThemeDecorator],
});

const CommonStoryTemplate = meta.story({
  args: { totalItems: 237 },
  render: (_, { component }) => {
    const Component = component!;

    return (
      <VStack width="720px" maxWidth="full" gap="x5" align="stretch">
        <VStack gap="x1" align="stretch">
          <Text textStyle="t3Regular" color="fg.neutralMuted">
            알려진 총합
          </Text>
          <Component
            totalItems={237}
            value={{ page: 3, pageSize: 25 }}
            aria-label="알려진 총합 페이지 예시"
          />
        </VStack>
        <VStack gap="x1" align="stretch">
          <Text textStyle="t3Regular" color="fg.neutralMuted">
            전체 개수 미확정
          </Text>
          <Component
            value={{ page: 3, pageSize: 10 }}
            hasPreviousPage
            hasNextPage
            currentPageItemCount={10}
            aria-label="전체 개수 미확정 페이지 예시"
          />
        </VStack>
        <VStack gap="x1" align="stretch">
          <Text textStyle="t3Regular" color="fg.neutralMuted">
            전체 개수 미확정 마지막 페이지
          </Text>
          <Component
            value={{ page: 5, pageSize: 10 }}
            hasPreviousPage
            hasNextPage={false}
            currentPageItemCount={7}
            aria-label="전체 개수 미확정 마지막 페이지 예시"
          />
        </VStack>
        <VStack gap="x1" align="stretch">
          <Text textStyle="t3Regular" color="fg.neutralMuted">
            빈 데이터
          </Text>
          <Component totalItems={0} aria-label="빈 데이터 페이지 예시" />
        </VStack>
        <VStack gap="x1" align="stretch">
          <Text textStyle="t3Regular" color="fg.neutralMuted">
            비활성
          </Text>
          <Component
            totalItems={237}
            value={{ page: 3, pageSize: 25 }}
            disabled
            aria-label="비활성 페이지 예시"
          />
        </VStack>
      </VStack>
    );
  },
});

export const LightTheme = CommonStoryTemplate.extend({
  parameters: withChromaticParameters({}),
});

export const DarkTheme = CommonStoryTemplate.extend({
  parameters: withChromaticParameters({ theme: "dark" }),
});

export const FontScalingExtraSmall = CommonStoryTemplate.extend({
  parameters: withChromaticParameters({ fontScale: "Extra Small" }),
});

export const FontScalingExtraExtraExtraLarge = CommonStoryTemplate.extend({
  parameters: withChromaticParameters({ fontScale: "Extra Extra Extra Large" }),
});

export const LongNumbers = meta.story({
  args: { totalItems: 9_999_999_999 },
  render: (_, { component }) => {
    const Component = component!;

    return (
      <VStack width="960px" maxWidth="full" gap="x4" align="stretch">
        <Component
          totalItems={9_999_999_999}
          value={{ page: 123_456, pageSize: 10 }}
          pageOptions={[1, 123_456, 1_000_000_000]}
          aria-label="긴 숫자 페이지 예시"
        />
      </VStack>
    );
  },
  parameters: withChromaticParameters({}),
});
