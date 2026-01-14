import type { Meta, StoryObj } from "@storybook/nextjs";

import { RadioSelectBoxItem, RadioSelectBoxRoot } from "seed-design/ui/select-box";
import { Box, PrefixIcon, Text } from "@seed-design/react";
import { IconPersonCircleLine } from "@karrotmarket/react-monochrome-icon";

import { SeedThemeDecorator } from "./components/decorator";
import { VariantTable } from "./components/variant-table";
import { createStoryWithParameters } from "@/stories/utils/parameters";

const meta = {
  component: RadioSelectBoxRoot,
  decorators: [SeedThemeDecorator],
} satisfies Meta<typeof RadioSelectBoxRoot>;

export default meta;

type Story = StoryObj<typeof meta>;

const RadioSelectBoxWrapper = ({ columns, ...props }: { columns?: number }) => {
  return (
    <RadioSelectBoxRoot columns={columns} defaultValue="item1" aria-label="선택 상자 예시">
      <RadioSelectBoxItem value="item1" label="레이블만" {...props} />
      <RadioSelectBoxItem
        value="item2"
        label="설명 포함"
        description="보조 설명 텍스트입니다."
        {...props}
      />
      <RadioSelectBoxItem
        value="item3"
        label="아이콘 포함"
        prefixIcon={<PrefixIcon svg={<IconPersonCircleLine />} />}
        {...props}
      />
      <RadioSelectBoxItem
        value="item4"
        label="전체 포함"
        description="보조 설명 텍스트입니다."
        prefixIcon={<PrefixIcon svg={<IconPersonCircleLine />} />}
        {...props}
      />
    </RadioSelectBoxRoot>
  );
};

const conditionMap = {
  columns: {
    1: { columns: 1 },
    2: { columns: 2 },
    3: { columns: 3 },
  },
  disabled: {
    false: {
      disabled: false,
    },
    true: {
      disabled: true,
    },
  },
};

const CommonStoryTemplate: Story = {
  render: () => (
    <VariantTable Component={RadioSelectBoxWrapper} variantMap={{}} conditionMap={conditionMap} />
  ),
};

export const LightTheme = CommonStoryTemplate;

export const DarkTheme = createStoryWithParameters({
  ...CommonStoryTemplate,
  parameters: { theme: "dark" },
});

export const FontScalingExtraSmall = createStoryWithParameters({
  ...CommonStoryTemplate,
  parameters: { fontScale: "Extra Small" },
});

export const FontScalingExtraExtraExtraLarge = createStoryWithParameters({
  ...CommonStoryTemplate,
  parameters: { fontScale: "Extra Extra Extra Large" },
});

export const CollapsibleFooter: Story = {
  render: () => (
    <RadioSelectBoxRoot defaultValue="item1" aria-label="Footer 테스트">
      <RadioSelectBoxItem
        value="item1"
        label="선택 시에만 표시 (기본값)"
        description="기본적으로 선택 시에만 footer가 보입니다."
        footer={
          <Box px="x5" pb="x5">
            <Text textStyle="t3StaticMedium">이 항목이 선택되었을 때만 보입니다.</Text>
          </Box>
        }
      />
      <RadioSelectBoxItem
        value="item2"
        label="항상 표시"
        description="footerVisibility를 'always'로 설정하면 항상 보입니다."
        footerVisibility="always"
        footer={
          <Box px="x5" pb="x5">
            <Text textStyle="t3StaticMedium">이 영역을 클릭해도 항목이 선택됩니다.</Text>
          </Box>
        }
      />
      <RadioSelectBoxItem
        value="item3"
        label="긴 내용 테스트"
        description="동적 높이 변화 테스트"
        footer={
          <Box bgGradient="highlightMagic" bgGradientDirection="to bottom right" height="300px" />
        }
      />
      <RadioSelectBoxItem
        value="item4"
        label="Footer 없음"
        description="footer 없이 사용하는 경우 (aria-expanded 없음)"
      />
    </RadioSelectBoxRoot>
  ),
};
