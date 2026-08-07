import preview from "../.storybook/preview";
import { SegmentedControl, SegmentedControlItem } from "seed-design/ui/segmented-control";

import { segmentedControlVariantMap } from "@seed-design/css/recipes/segmented-control";
import { SeedThemeDecorator } from "./components/decorator";
import { VariantTable } from "./components/variant-table";
import { useState } from "react";
import { createStoryParameters } from "@/stories/utils/parameters";

const Component = ({ disabled }: { disabled: boolean }) => {
  const values = ["dolor", "magna", "sint"];
  const [value, setValue] = useState(values[0]);

  return (
    <SegmentedControl
      value={value}
      onValueChange={setValue}
      disabled={disabled}
      aria-label="Segmented Control"
    >
      {values.map((value) => (
        <SegmentedControlItem key={value} value={value}>
          {value}
        </SegmentedControlItem>
      ))}
    </SegmentedControl>
  );
};

const meta = preview.meta({
  component: SegmentedControl,
  decorators: [SeedThemeDecorator],
});
const conditionMap = {
  disabled: {
    false: { disabled: false },
    true: { disabled: true },
  },
};

const CommonStoryTemplate = meta.story({
  render: function Render(args) {
    return (
      <VariantTable
        Component={Component}
        variantMap={segmentedControlVariantMap}
        conditionMap={conditionMap}
        {...args}
      />
    );
  },
});

export const LightTheme = CommonStoryTemplate.extend({});

export const DarkTheme = CommonStoryTemplate.extend({
  parameters: createStoryParameters({ theme: "dark" }),
});

export const FontScalingExtraSmall = CommonStoryTemplate.extend({
  parameters: createStoryParameters({ fontScale: "Extra Small" }),
});

export const FontScalingExtraExtraExtraLarge = CommonStoryTemplate.extend({
  parameters: createStoryParameters({ fontScale: "Extra Extra Extra Large" }),
});
