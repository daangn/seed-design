import preview from "../.storybook/preview";
import { Switch } from "seed-design/ui/switch";

import { switchVariantMap } from "@seed-design/css/recipes/switch";
import { SeedThemeDecorator } from "./components/decorator";
import { VariantTable } from "./components/variant-table";
import { withVisualTestParameters } from "@/stories/utils/parameters";

const meta = preview.meta({
  component: Switch,
  decorators: [SeedThemeDecorator],
});
const conditionMap = {
  disabled: {
    false: { disabled: false },
    true: { disabled: true },
  },
};

const CommonStoryTemplate = meta.story({
  args: {
    label: "라벨",
  },
  render: (args, { component }) => (
    <VariantTable
      Component={component!}
      variantMap={switchVariantMap}
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
