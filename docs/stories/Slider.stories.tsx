import preview from "../.storybook/preview";
import { Slider } from "seed-design/ui/slider";

import { withVisualTestParameters } from "@/stories/utils/parameters";
import { sliderVariantMap } from "@seed-design/css/recipes/slider";
import { sliderTickVariantMap } from "@seed-design/css/recipes/slider-tick";
import { SeedThemeDecorator } from "./components/decorator";
import { VariantTable } from "./components/variant-table";

const meta = preview.meta({
  component: Slider,
  decorators: [SeedThemeDecorator],
});
const conditionMap = {
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
    single: { defaultValues: [50] },
    range: { defaultValues: [0, 50], minStepsBetweenThumbs: 20 },
  },
};

const CommonStoryTemplate = meta.story({
  args: {
    min: 0,
    max: 100,

    getValueIndicatorLabel: ({ thumbIndex, value }) => `Thumb ${thumbIndex}: ${value}`,
    ticks: [20, 40, 60, 80],
  },
  render: (args, { component }) => (
    <VariantTable
      Component={component!}
      variantMap={{ ...sliderVariantMap, ...sliderTickVariantMap }}
      conditionMap={conditionMap}
      {...args}
    />
  ),
});

export const LightTheme = CommonStoryTemplate.extend({});

export const DarkTheme = CommonStoryTemplate.extend({
  parameters: withVisualTestParameters({ theme: "dark" }),
});

export const FontScalingExtraSmall = CommonStoryTemplate.extend({
  parameters: withVisualTestParameters({ fontScale: "Extra Small" }),
});

export const FontScalingExtraExtraExtraLarge = CommonStoryTemplate.extend({
  parameters: withVisualTestParameters({ fontScale: "Extra Extra Extra Large" }),
});
