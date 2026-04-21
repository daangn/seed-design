import type { Meta, StoryObj } from "@storybook/nextjs";

import { ContentPlaceholder } from "seed-design/ui/content-placeholder";

import { createStoryWithParameters } from "@/stories/utils/parameters";
import { contentPlaceholderVariantMap } from "@seed-design/css/recipes/content-placeholder";
import { SeedThemeDecorator } from "./components/decorator";
import { VariantTable } from "./components/variant-table";
import { IconSparkle2Fill } from "@karrotmarket/react-monochrome-icon";

const meta = {
  component: ContentPlaceholder,
  decorators: [SeedThemeDecorator],
} satisfies Meta<typeof ContentPlaceholder>;

export default meta;

type Story = StoryObj<typeof meta>;

const { type: _type, ...variantMap } = contentPlaceholderVariantMap;

const conditionMap = {
  size: {
    square: {
      style: {
        width: "120px",
        height: "120px",
      },
    },
    horizontal: {
      style: {
        width: "200px",
        height: "150px",
      },
    },
    vertical: {
      style: {
        width: "100px",
        height: "133px",
      },
    },
  },
  type: {
    ...Object.fromEntries(
      contentPlaceholderVariantMap.type.map((value) => [value, { type: value }]),
    ),
    custom: { children: <IconSparkle2Fill /> },
  },
};

const CommonStoryTemplate: Story = {
  args: {},
  render: (args) => (
    <VariantTable
      Component={meta.component}
      variantMap={variantMap}
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
