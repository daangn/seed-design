import type { Meta, StoryObj } from "@storybook/nextjs";

import {
  CheckSelectBox,
  CheckSelectBoxCheckmark,
  CheckSelectBoxGroup,
} from "seed-design/ui/select-box";
import { IconPersonCircleLine } from "@karrotmarket/react-monochrome-icon";

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
