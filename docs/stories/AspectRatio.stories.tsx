import type { Meta, StoryObj } from "@storybook/nextjs";

import { AspectRatio, Text } from "@seed-design/react";

import { createStoryWithParameters } from "@/stories/utils/parameters";
import { SeedThemeDecorator } from "./components/decorator";
import { VariantTable } from "./components/variant-table";

const AspectRatioPreview = ({ ratio = 4 / 3, label }: { ratio?: number; label?: string }) => (
  <AspectRatio ratio={ratio} width="160px" bg="palette.gray100">
    <Text color="palette.gray700" textStyle="t5Bold">
      {label}
    </Text>
  </AspectRatio>
);

const meta = {
  component: AspectRatioPreview,
  decorators: [SeedThemeDecorator],
} satisfies Meta<typeof AspectRatioPreview>;

export default meta;

type Story = StoryObj<typeof meta>;

const conditionMap = {
  ratio: {
    "1 / 1": { ratio: 1, label: "1 / 1" },
    "4 / 3": { ratio: 4 / 3, label: "4 / 3" },
    "16 / 9": { ratio: 16 / 9, label: "16 / 9" },
    "3 / 4": { ratio: 3 / 4, label: "3 / 4" },
  },
};

const CommonStoryTemplate: Story = {
  render: (args) => (
    <VariantTable
      Component={meta.component}
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
