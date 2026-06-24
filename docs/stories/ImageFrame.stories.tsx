import type { Meta, StoryObj } from "@storybook/nextjs";

import { ImageFrame } from "@seed-design/react";

import { imageFrameVariantMap } from "@seed-design/css/recipes/image-frame";
import { createStoryWithParameters } from "@/stories/utils/parameters";
import { SeedThemeDecorator } from "./components/decorator";
import { VariantTable } from "./components/variant-table";

const SAMPLE_IMAGE = `data:image/svg+xml,${encodeURIComponent(
  "<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'><stop offset='0' stop-color='#6ba6ff'/><stop offset='1' stop-color='#b06bff'/></linearGradient></defs><rect width='200' height='200' fill='url(#g)'/></svg>",
)}`;

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
    src: SAMPLE_IMAGE,
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
