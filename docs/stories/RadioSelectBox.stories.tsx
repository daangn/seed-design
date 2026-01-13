import type { Meta, StoryObj } from "@storybook/nextjs";

import { RadioSelectBoxItem, RadioSelectBoxRoot } from "seed-design/ui/select-box";
import { PrefixIcon } from "@seed-design/react";
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
