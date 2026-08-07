import preview from "../.storybook/preview";
import {
  ChipTabsRoot,
  ChipTabsRootProps,
  ChipTabsTrigger,
  ChipTabsList,
} from "seed-design/ui/chip-tabs";

import { chipTabsVariantMap } from "@seed-design/css/recipes/chip-tabs";
import { SeedThemeDecorator } from "./components/decorator";
import { VariantTable } from "./components/variant-table";
import { createStoryParameters } from "@/stories/utils/parameters";

const TAB_VALUES = Array.from({ length: 20 }, (_, i) => String(i + 1));

const Component = (props: ChipTabsRootProps) => {
  return (
    // Constrain the width so the list overflows; otherwise the trigger-shrink bug never surfaces.
    <div style={{ maxWidth: 360 }}>
      <ChipTabsRoot {...props}>
        <ChipTabsList>
          {TAB_VALUES.map((value) => (
            <ChipTabsTrigger key={value} value={value}>
              Tab {value}
            </ChipTabsTrigger>
          ))}
        </ChipTabsList>
      </ChipTabsRoot>
    </div>
  );
};

const meta = preview.meta({
  component: ChipTabsRoot,
  decorators: [SeedThemeDecorator],
});
const CommonStoryTemplate = meta.story({
  args: {
    defaultValue: "1",
  },
  render: function Render(args) {
    return <VariantTable Component={Component} variantMap={chipTabsVariantMap} {...args} />;
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
