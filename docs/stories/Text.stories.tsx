import type { Meta, StoryObj } from "@storybook/nextjs";

import { Text } from "@seed-design/react";

import { textVariantMap } from "@seed-design/css/recipes/text";
import { VariantTable } from "./components/variant-table";
import { SeedThemeDecorator } from "./components/decorator";
import { createStoryWithParameters } from "@/stories/utils/parameters";

const meta = {
  component: Text,
  decorators: [SeedThemeDecorator],
} satisfies Meta<typeof Text>;

export default meta;

type Story = StoryObj<typeof meta>;

const CommonStoryTemplate: Story = {
  args: {
    children: "다람쥐 헌 쳇바퀴에 타고파",
  },
  render: (args) => (
    <VariantTable Component={meta.component} variantMap={textVariantMap} {...args} />
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
