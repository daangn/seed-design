import type { Meta, StoryObj } from "@storybook/nextjs";

import {
  RadioSelectBoxItem,
  RadioSelectBoxRadiomark,
  RadioSelectBoxRoot,
} from "seed-design/ui/select-box";
import { IconPersonCircleLine } from "@karrotmarket/react-monochrome-icon";
import { Box, Text } from "@seed-design/react";

import { SeedThemeDecorator } from "./components/decorator";
import { VariantTable } from "./components/variant-table";
import { createStoryWithParameters } from "@/stories/utils/parameters";

const meta = {
  component: RadioSelectBoxItem,
  decorators: [SeedThemeDecorator],
} satisfies Meta<typeof RadioSelectBoxItem>;

export default meta;

type Story = StoryObj<typeof meta>;

const RadioSelectBoxWrapper = ({ columns, ...props }: { columns?: number }) => {
  return (
    <RadioSelectBoxRoot columns={columns} defaultValue="item1" aria-label="선택 상자 예시">
      <RadioSelectBoxItem value="item1" label="" {...props} />
      <RadioSelectBoxItem value="item2" label="" description="보조 설명 텍스트입니다." {...props} />
      <RadioSelectBoxItem value="item3" label="" prefixIcon={<IconPersonCircleLine />} {...props} />
      <RadioSelectBoxItem
        value="item4"
        label=""
        description="보조 설명 텍스트입니다."
        prefixIcon={<IconPersonCircleLine />}
        {...props}
      />
      <RadioSelectBoxItem
        value="item5"
        label=""
        description="선택 시에만 footer가 보입니다."
        footer={
          <Box px="x5" pb="x5">
            <Text textStyle="t3Medium">선택되었을 때만 보이는 footer입니다.</Text>
          </Box>
        }
        {...props}
      />
      <RadioSelectBoxItem
        value="item6"
        label=""
        description="항상 footer가 보입니다."
        footerVisibility="always"
        footer={
          <Box px="x5" pb="x5">
            <Text textStyle="t3Medium">항상 보이는 footer입니다.</Text>
          </Box>
        }
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
  suffix: {
    radioMark: {
      suffix: <RadioSelectBoxRadiomark />,
    },
    none: {
      suffix: undefined,
    },
  },
};

const CommonStoryTemplate: Story = {
  // @ts-expect-error
  args: {
    label: "Aliqua veniam ut nisi dolore velit deserunt excepteur adipisicing",
  },
  render: (args) => (
    <VariantTable
      Component={RadioSelectBoxWrapper}
      variantMap={{}}
      conditionMap={conditionMap}
      {...args}
    />
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
