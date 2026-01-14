import type { Meta, StoryObj } from "@storybook/nextjs";

import {
  CheckSelectBox,
  CheckSelectBoxCheckmark,
  CheckSelectBoxGroup,
} from "seed-design/ui/select-box";
import { IconPersonCircleLine } from "@karrotmarket/react-monochrome-icon";
import { Box, Text } from "@seed-design/react";

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
      <CheckSelectBox label="" {...props} />
      <CheckSelectBox label="" description="보조 설명 텍스트입니다." {...props} />
      <CheckSelectBox label="" prefixIcon={<IconPersonCircleLine />} {...props} />
      <CheckSelectBox
        label=""
        description="보조 설명 텍스트입니다."
        prefixIcon={<IconPersonCircleLine />}
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
  defaultChecked: {
    false: {
      defaultChecked: false,
    },
    true: {
      defaultChecked: true,
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

export const CollapsibleFooter: Story = {
  args: {
    label: "Footer 테스트",
  },
  render: () => (
    <CheckSelectBoxGroup columns={1}>
      <CheckSelectBox
        label="선택 시에만 표시 (기본값)"
        description="기본적으로 선택 시에만 footer가 보입니다."
        suffix={<CheckSelectBoxCheckmark />}
        defaultChecked
        footer={
          <Box px="x5" pb="x5">
            <Text textStyle="t3StaticMedium">이 항목이 선택되었을 때만 보입니다.</Text>
          </Box>
        }
      />
      <CheckSelectBox
        label="항상 표시"
        description="footerVisibility를 'always'로 설정하면 항상 보입니다."
        suffix={<CheckSelectBoxCheckmark />}
        footerVisibility="always"
        footer={
          <Box px="x5" pb="x5">
            <Text textStyle="t3StaticMedium">이 영역을 클릭해도 항목이 선택됩니다.</Text>
          </Box>
        }
      />
      <CheckSelectBox
        label="긴 내용 테스트"
        description="동적 높이 변화 테스트"
        suffix={<CheckSelectBoxCheckmark />}
        footer={
          <Box bgGradient="highlightMagic" bgGradientDirection="to bottom right" height="300px" />
        }
      />
    </CheckSelectBoxGroup>
  ),
};
