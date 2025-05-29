import type { Meta, StoryObj } from "@storybook/nextjs";

import { SegmentedControl, SegmentedControlItem } from "seed-design/ui/segmented-control";

import { segmentedControlVariantMap } from "@seed-design/css/recipes/segmented-control";
import { SeedThemeDecorator } from "./components/decorator";
import { VariantTable } from "./components/variant-table";
import { useState } from "react";
import { createStoryWithParameters } from "@/stories/utils/parameters";

const Component = ({ disabled }: { disabled: boolean }) => {
  const values = ["dolor", "magna", "sint"];
  const [value, setValue] = useState(values[0]);

  return (
    <SegmentedControl value={value} onValueChange={setValue} disabled={disabled}>
      {values.map((value) => (
        <SegmentedControlItem key={value} value={value}>
          {value}
        </SegmentedControlItem>
      ))}
    </SegmentedControl>
  );
};

const meta = {
  component: SegmentedControl,
  decorators: [SeedThemeDecorator],
} satisfies Meta<typeof SegmentedControl>;

export default meta;

type Story = StoryObj<typeof meta>;

const conditionMap = {
  disabled: {
    false: { disabled: false },
    true: { disabled: true },
  },
};

const CommonStoryTemplate: Story = {
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
