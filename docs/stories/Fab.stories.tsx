import type { Meta, StoryObj } from "@storybook/react";

import { Fab, Icon } from "@seed-design/react";

import { IconBellFill } from "@daangn/react-monochrome-icon";
import { fabVariantMap } from "@seed-design/css/recipes/fab";
import { SeedThemeDecorator } from "./components/decorator";
import { VariantTable } from "./components/variant-table";
import { createStoryWithParameters } from "@/stories/utils/parameters";

const meta = {
  component: Fab,
  decorators: [SeedThemeDecorator],
} satisfies Meta<typeof Fab>;

export default meta;

type Story = StoryObj<typeof meta>;

const CommonStoryTemplate: Story = {
  args: {
    children: <Icon svg={<IconBellFill />} />,
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
