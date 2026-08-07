import preview from "../.storybook/preview";
import { FloatingActionButton } from "seed-design/ui/floating-action-button";

import { createStoryParameters } from "@/stories/utils/parameters";
import { IconBellFill } from "@karrotmarket/react-monochrome-icon";
import { floatingActionButtonVariantMap } from "@seed-design/css/recipes/floating-action-button";
import { SeedThemeDecorator } from "./components/decorator";
import { VariantTable } from "./components/variant-table";

const meta = preview.meta({
  component: FloatingActionButton,
  decorators: [SeedThemeDecorator],
});
const CommonStoryTemplate = meta.story({
  args: {
    icon: <IconBellFill />,
    label: "Example FAB",
  },
  render: (args) => (
    <VariantTable
      Component={FloatingActionButton}
      variantMap={floatingActionButtonVariantMap}
      {...args}
    />
  ),
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
