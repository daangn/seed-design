import type { Meta, StoryObj } from "@storybook/nextjs";

import { MannerTemp } from "seed-design/ui/manner-temp";

import { mannerTempVariantMap } from "@ride-developer/css/recipes/manner-temp";
import { VariantTable } from "./components/variant-table";
import { SeedThemeDecorator } from "./components/decorator";
import { createStoryWithParameters } from "@/stories/utils/parameters";

const meta = {
  component: MannerTemp,
  decorators: [SeedThemeDecorator],
} satisfies Meta<typeof MannerTemp>;

export default meta;

type Story = StoryObj<typeof meta>;

const conditionMap = {
  level: {
    l1: {
      temperature: 12.5,
    },
    l2: {
      temperature: 30,
    },
    l3: {
      temperature: 36,
    },
    l4: {
      temperature: 36.5,
    },
    l5: {
      temperature: 37,
    },
    l6: {
      temperature: 40,
    },
    l7: {
      temperature: 45,
    },
    l8: {
      temperature: 55,
    },
    l9: {
      temperature: 65,
    },
    l10: {
      temperature: 80,
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
      variantMap={mannerTempVariantMap}
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
