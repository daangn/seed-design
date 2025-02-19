import type { Meta, StoryObj } from "@storybook/react";

import { ExtendedFab } from "@seed-design/react";

import { IconBellFill } from "@daangn/react-monochrome-icon";
import { extendedFabVariantMap } from "@seed-design/css/recipes/extended-fab";
import { SeedThemeDecorator } from "./components/decorator";
import { VariantTable } from "./components/variant-table";
import { createStoryWithParameters } from "@/stories/utils/parameters";
import { PrefixIcon } from "@seed-design/react";

const meta = {
  component: ExtendedFab,
  decorators: [SeedThemeDecorator],
} satisfies Meta<typeof ExtendedFab>;

export default meta;

type Story = StoryObj<typeof meta>;

const CommonStoryTemplate: Story = {
  args: {
    children: (
      <>
        <PrefixIcon svg={<IconBellFill />} />
        라벨
      </>
    ),
  },
  render: (args) => (
    <VariantTable Component={meta.component} variantMap={extendedFabVariantMap} {...args} />
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
