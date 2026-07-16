import type { Meta, StoryObj } from "@storybook/nextjs";

import {
  ChipTabsRoot,
  ChipTabsRootProps,
  ChipTabsTrigger,
  ChipTabsList,
} from "seed-design/ui/chip-tabs";

import { chipTabsVariantMap } from "@seed-design/css/recipes/chip-tabs";
import { SeedThemeDecorator } from "./components/decorator";
import { VariantTable } from "./components/variant-table";
import { createStoryWithParameters } from "@/stories/utils/parameters";

const TAB_VALUES = Array.from({ length: 20 }, (_, i) => String(i + 1));

const Component = (props: ChipTabsRootProps) => {
  return (
    <ChipTabsRoot {...props}>
      <ChipTabsList>
        {TAB_VALUES.map((value) => (
          <ChipTabsTrigger key={value} value={value}>
            Tab {value}
          </ChipTabsTrigger>
        ))}
      </ChipTabsList>
    </ChipTabsRoot>
  );
};

const meta = {
  component: ChipTabsRoot,
  decorators: [SeedThemeDecorator],
} satisfies Meta<typeof ChipTabsRoot>;

export default meta;

type Story = StoryObj<typeof meta>;

const CommonStoryTemplate: Story = {
  args: {
    defaultValue: "1",
  },
  render: function Render(args) {
    return <VariantTable Component={Component} variantMap={chipTabsVariantMap} {...args} />;
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
