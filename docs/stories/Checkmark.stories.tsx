import preview from "../.storybook/preview";
import { Checkmark } from "seed-design/ui/checkbox";
import {
  checkmark,
  checkmarkVariantMap,
  type CheckmarkVariantProps,
} from "@seed-design/css/recipes/checkmark";
import { VariantTable } from "./components/variant-table";
import { SeedThemeDecorator } from "./components/decorator";
import { withVisualTestParameters } from "@/stories/utils/parameters";
import { Checkbox } from "@seed-design/react";

function CustomCheckbox(props: CheckmarkVariantProps & Checkbox.RootPrimitiveProps) {
  const [checkmarkVariantProps, otherProps] = checkmark.splitVariantProps(props);

  return (
    <Checkbox.Root.Primitive {...otherProps}>
      <Checkmark {...checkmarkVariantProps} />
      <Checkbox.HiddenInput />
    </Checkbox.Root.Primitive>
  );
}

const meta = preview.meta({
  component: CustomCheckbox,
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
  state: {
    checked: {
      checked: true,
      indeterminate: false,
    },
    indeterminate: {
      checked: false,
      indeterminate: true,
    },
    unchecked: {
      checked: false,
      indeterminate: false,
    },
  },
};

const CommonStoryTemplate = meta.story({
  render: (args, { component }) => (
    <VariantTable
      Component={component!}
      variantMap={checkmarkVariantMap}
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
