import type { Meta, StoryObj } from "@storybook/nextjs";

import { selectBoxGroupVariantMap } from "@seed-design/css/recipes/select-box-group";
import { CheckSelectBox } from "seed-design/ui/select-box";

import { SeedThemeDecorator } from "./components/decorator";
import { VariantTable } from "./components/variant-table";
import { createStoryWithParameters } from "@/stories/utils/parameters";

const meta = {
  component: CheckSelectBox,
  decorators: [SeedThemeDecorator],
} satisfies Meta<typeof CheckSelectBox>;

export default meta;

type Story = StoryObj<typeof meta>;

const conditionMap = {
  checked: {
    false: {
      defaultChecked: false,
    },
    true: {
      defaultChecked: true,
    },
  },
};

const CommonStoryTemplate: Story = {
  args: {
    defaultValue: "dolor",
    label: "sint",
    description: "sint",
  },
  render: (args) => {
    return (
      <VariantTable
        Component={CheckSelectBox}
        variantMap={selectBoxGroupVariantMap}
        conditionMap={conditionMap}
        {...args}
      />
    );
  },
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
