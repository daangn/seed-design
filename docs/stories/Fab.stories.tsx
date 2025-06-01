import type { Meta, StoryObj } from "@storybook/nextjs";

import { Fab } from "seed-design/ui/fab";

import { createStoryWithParameters } from "@/stories/utils/parameters";
import { IconBellFill } from "@karrotmarket/react-monochrome-icon";
import { fabVariantMap } from "@seed-design/css/recipes/fab";
import { SeedThemeDecorator } from "./components/decorator";
import { VariantTable } from "./components/variant-table";

const meta = {
  component: Fab,
  decorators: [SeedThemeDecorator],
} satisfies Meta<typeof Fab>;

export default meta;

type Story = StoryObj<typeof meta>;

const CommonStoryTemplate: Story = {
  args: {
    icon: <IconBellFill />,
    label: "Example FAB",
  },
  render: (args) => (
    <VariantTable Component={meta.component} variantMap={fabVariantMap} {...args} />
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
