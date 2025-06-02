import type { Meta, StoryObj } from "@storybook/nextjs";

import { FloatingActionButton } from "@/registry/ui/floating-action-button";

import { createStoryWithParameters } from "@/stories/utils/parameters";
import { IconBellFill } from "@karrotmarket/react-monochrome-icon";
import { floatingActionButtonVariantMap } from "@seed-design/css/recipes/floating-action-button";
import { SeedThemeDecorator } from "./components/decorator";
import { VariantTable } from "./components/variant-table";

const meta = {
  component: FloatingActionButton,
  decorators: [SeedThemeDecorator],
} satisfies Meta<typeof FloatingActionButton>;

export default meta;

type Story = StoryObj<typeof meta>;

const CommonStoryTemplate: Story = {
  args: {
    icon: <IconBellFill />,
    label: "Example FAB",
  },
  render: (args) => (
    <VariantTable
      Component={meta.component}
      variantMap={floatingActionButtonVariantMap}
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
