import type { Meta, StoryObj } from "@storybook/nextjs";

import {
  CheckSelectBox,
  CheckSelectBoxCheckmark,
  CheckSelectBoxGroup,
} from "seed-design/ui/select-box";
import { IconPersonCircleLine } from "@karrotmarket/react-monochrome-icon";
import { Box, Text } from "@ride-developer/react";

import { SeedThemeDecorator } from "./components/decorator";
import { VariantTable } from "./components/variant-table";
import { createStoryWithParameters } from "@/stories/utils/parameters";

const meta = {
  component: CheckSelectBox,
  decorators: [SeedThemeDecorator],
} satisfies Meta<typeof CheckSelectBox>;

export default meta;

type Story = StoryObj<typeof meta>;

const CheckSelectBoxWrapper = ({ columns, ...props }: { columns?: number }) => {
  return (
    <CheckSelectBoxGroup columns={columns}>
      <CheckSelectBox label="" defaultChecked {...props} />
      <CheckSelectBox label="" description="보조 설명 텍스트입니다." {...props} />
      <CheckSelectBox label="" prefixIcon={<IconPersonCircleLine />} {...props} />
      <CheckSelectBox
        label=""
        description="보조 설명 텍스트입니다."
        prefixIcon={<IconPersonCircleLine />}
        {...props}
      />
      <CheckSelectBox
        label=""
        description="선택 시에만 footer가 보입니다."
        footer={
          <Box px="x5" pb="x5">
            <Text textStyle="t3Medium">선택되었을 때만 보이는 footer입니다.</Text>
          </Box>
        }
        {...props}
      />
      <CheckSelectBox
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
    </CheckSelectBoxGroup>
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
    checkmark: {
      suffix: <CheckSelectBoxCheckmark />,
    },
    none: {
      suffix: undefined,
    },
  },
};

const CommonStoryTemplate: Story = {
  args: {
    label: "Aliqua veniam ut nisi dolore velit deserunt excepteur adipisicing",
  },
  render: (args) => (
    <VariantTable
      Component={CheckSelectBoxWrapper}
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
