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

const conditionMap = {
  ratio: {
    "1": { ratio: 1, style: { width: "96px" } },
    "4/3": { ratio: 4 / 3, style: { width: "120px" } },
    "16/9": { ratio: 16 / 9, style: { width: "160px" } },
  },
  borderRadius: {
    "not-set": {},
    0: { borderRadius: "0" },
    r4: { borderRadius: "r4" },
    full: { borderRadius: "full" },
  },
};

const CommonStoryTemplate: Story = {
  args: {
    src: "https://avatars.githubusercontent.com/u/54893898?v=4",
    alt: "ImageFrame placeholder",
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
