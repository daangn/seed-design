import type { Meta, StoryObj } from "@storybook/nextjs";

import { ImageFrame } from "@seed-design/react";

import { imageFrameVariantMap } from "@seed-design/css/recipes/image-frame";
import { createStoryWithParameters } from "@/stories/utils/parameters";
import { SeedThemeDecorator } from "./components/decorator";
import { VariantTable } from "./components/variant-table";

const meta = {
  component: ImageFrame,
  decorators: [SeedThemeDecorator],
} satisfies Meta<typeof ImageFrame>;

export default meta;

type Story = StoryObj<typeof meta>;

const IMAGE_SRC = "https://images.unsplash.com/photo-1535025183041-0991a977e25b?w=400&dpr=2&q=80";

const conditionMap = {
  sizing: {
    w200_defaultRatio: { width: "200px" },
    w200_r1: { width: "200px", ratio: 1 },
    w200_r4_3: { width: "200px", ratio: 4 / 3 },
    w200_r16_9: { width: "200px", ratio: 16 / 9 },
    w200_h150_r4_3: { width: "200px", height: "150px", ratio: 4 / 3 },
    w200_h200_r4_3: { width: "200px", height: "200px", ratio: 4 / 3 },
  },
};

const CommonStoryTemplate: Story = {
  args: {
    src: IMAGE_SRC,
    alt: "Landscape photograph by Tobias Tullius",
  },
  render: (args) => (
    <VariantTable
      Component={meta.component}
      variantMap={imageFrameVariantMap}
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
