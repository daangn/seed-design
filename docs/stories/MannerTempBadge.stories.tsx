import type { Meta, StoryObj } from "@storybook/nextjs";

import { MannerTempBadge } from "seed-design/ui/manner-temp-badge";

import { mannerTempBadgeVariantMap } from "@seed-design/css/recipes/manner-temp-badge";
import { VariantTable } from "./components/variant-table";
import { SeedThemeDecorator } from "./components/decorator";
import { createStoryWithParameters } from "@/stories/utils/parameters";

const meta = {
  component: MannerTempBadge,
  decorators: [SeedThemeDecorator],
} satisfies Meta<typeof MannerTempBadge>;

export default meta;

type Story = StoryObj<typeof meta>;

const conditionMap = {
  level: {
    l1: {
      temperature: 12.5,
    },
    l2: {
      temperature: 36.2,
    },
    l3: {
      temperature: 36.5,
    },
    l4: {
      temperature: 41.9,
    },
    l5: {
      temperature: 51.9,
    },
    l6: {
      temperature: 52,
    },
  },
};

const CommonStoryTemplate: Story = {
  args: {
    temperature: 0, // intentionally ignored
  },
  render: () => (
    <VariantTable
      Component={meta.component}
      variantMap={mannerTempBadgeVariantMap}
      conditionMap={conditionMap}
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
