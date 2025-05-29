import type { Meta, StoryObj } from "@storybook/nextjs";

import { Checkbox } from "seed-design/ui/checkbox";

import { checkboxVariantMap } from "@seed-design/css/recipes/checkbox";
import { VariantTable } from "./components/variant-table";
import { SeedThemeDecorator } from "./components/decorator";
import { createStoryWithParameters } from "@/stories/utils/parameters";

const meta = {
  component: Checkbox,
  decorators: [SeedThemeDecorator],
} satisfies Meta<typeof Checkbox>;

export default meta;

type Story = StoryObj<typeof meta>;

const conditionMap = {
  indeterminate: {
    false: {
      indeterminate: false,
    },
    true: {
      indeterminate: true,
    },
  },
  checked: {
    false: {
      checked: false,
    },
    true: {
      checked: true,
    },
  },
};

const CommonStoryTemplate: Story = {
  args: {
    label: "Checkbox",
  },
  render: (args) => (
    <VariantTable
      Component={meta.component}
      variantMap={checkboxVariantMap}
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
