import preview from "../.storybook/preview";
import { Checkmark } from "seed-design/ui/checkbox";
import {
  checkmark,
  checkmarkVariantMap,
  type CheckmarkVariantProps,
} from "@seed-design/css/recipes/checkmark";
import { VariantTable } from "./components/variant-table";
import { SeedThemeDecorator } from "./components/decorator";
import { createStoryParameters } from "@/stories/utils/parameters";
import { Checkbox } from "@seed-design/react/primitive";

function CustomCheckbox(props: CheckmarkVariantProps & Checkbox.RootProps) {
  const [checkmarkVariantProps, otherProps] = checkmark.splitVariantProps(props);

  return (
    <Checkbox.Root {...otherProps}>
      <Checkmark {...checkmarkVariantProps} />
      <Checkbox.HiddenInput />
    </Checkbox.Root>
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
  render: (args) => (
    <VariantTable
      Component={CustomCheckbox}
      variantMap={checkmarkVariantMap}
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
