import type { Meta, StoryObj } from "@storybook/nextjs";

import { Slider } from "seed-design/ui/slider";

import { createStoryWithParameters } from "@/stories/utils/parameters";
import { sliderVariantMap } from "@seed-design/css/recipes/slider";
import { sliderTickVariantMap } from "@seed-design/css/recipes/slider-tick";
import { SeedThemeDecorator } from "./components/decorator";
import { VariantTable } from "./components/variant-table";

const meta = {
  component: Slider,
  decorators: [SeedThemeDecorator],
} satisfies Meta<typeof Slider>;

export default meta;

type Story = StoryObj<typeof meta>;

const conditionMap = {
  invalid: {
    valid: { invalid: false },
    invalid: { invalid: true },
  },
  disabled: {
    enabled: { disabled: false },
    disabled: { disabled: true },
  },
  dir: {
    ltr: { dir: "ltr" },
    rtl: { dir: "rtl" },
  },
  markers: {
    withMarkers: {
      markers: [
        { value: 0, label: "First" },
        { value: 20, label: "Another" },
        { value: 100, label: "Last" },
      ],
    },
    withoutMarkers: { markers: undefined },
  },
  layout: {
    single: { values: [50] },
    range: { values: [0, 50] },
  },
};

const CommonStoryTemplate: Story = {
  args: {
    label: "슬라이더",
    indicator: "인디케이터",
    description: "Exercitation dolore elit est mollit labore officia.",
    errorMessage: "This is an error message.",

    ticks: [20, 40, 60, 80],
  },
  render: (args) => (
    <VariantTable
      Component={meta.component}
      variantMap={{ ...sliderVariantMap, ...sliderTickVariantMap }}
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
