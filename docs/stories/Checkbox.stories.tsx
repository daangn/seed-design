import preview from "../.storybook/preview";
import { Checkbox } from "seed-design/ui/checkbox";

import { checkboxVariantMap } from "@seed-design/css/recipes/checkbox";
import { VariantTable } from "./components/variant-table";
import { SeedThemeDecorator } from "./components/decorator";
import { withVisualTestParameters } from "@/stories/utils/parameters";

const meta = preview.meta({
  component: Checkbox,
  decorators: [SeedThemeDecorator],
});
const conditionMap = {
  disabled: {
    false: {
      disabled: false,
    },
    true: {
      disabled: true,
    },
  },
};

const CommonStoryTemplate = meta.story({
  args: {
    label: "Checkbox",
  },
  render: (args, { component }) => (
    <VariantTable
      Component={component!}
      variantMap={checkboxVariantMap}
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
