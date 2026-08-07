import preview from "../.storybook/preview";
import { Switchmark } from "seed-design/ui/switch";

import {
  switchmark,
  switchmarkVariantMap,
  type SwitchmarkVariantProps,
} from "@seed-design/css/recipes/switchmark";
import { SeedThemeDecorator } from "./components/decorator";
import { VariantTable } from "./components/variant-table";
import { createStoryParameters } from "@/stories/utils/parameters";
import { Switch } from "@seed-design/react/primitive";

function CustomSwitch(props: SwitchmarkVariantProps & Switch.RootProps) {
  const [switchmarkVariantProps, otherProps] = switchmark.splitVariantProps(props);

  return (
    <Switch.Root {...otherProps}>
      <Switchmark {...switchmarkVariantProps} />
      <Switch.HiddenInput />
    </Switch.Root>
  );
}

const meta = preview.meta({
  component: CustomSwitch,
  decorators: [SeedThemeDecorator],
});
const conditionMap = {
  checked: {
    true: { checked: true },
    false: { checked: false },
  },
  disabled: {
    false: { disabled: false },
    true: { disabled: true },
  },
};

const CommonStoryTemplate = meta.story({
  render: (args) => (
    <VariantTable
      Component={CustomSwitch}
      variantMap={switchmarkVariantMap}
      conditionMap={conditionMap}
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
