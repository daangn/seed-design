import preview from "../.storybook/preview";
import { Radiomark } from "seed-design/ui/radio-group";
import {
  radiomark,
  radiomarkVariantMap,
  type RadiomarkVariantProps,
} from "@seed-design/css/recipes/radiomark";
import { VariantTable } from "./components/variant-table";
import { SeedThemeDecorator } from "./components/decorator";
import { createStoryParameters } from "@/stories/utils/parameters";
import { RadioGroup } from "@seed-design/react/primitive";

function CustomRadioGroup(
  props: RadiomarkVariantProps & {
    disabled?: boolean;
    selected?: boolean;
  },
) {
  const [radiomarkVariantProps, { disabled, selected, ..._otherProps }] =
    radiomark.splitVariantProps(props);

  return (
    <RadioGroup.Root disabled={disabled} value="foo" aria-label="Radiomark">
      <RadioGroup.Item value={selected ? "foo" : "bar"}>
        <Radiomark {...radiomarkVariantProps} />
        <RadioGroup.ItemHiddenInput />
      </RadioGroup.Item>
    </RadioGroup.Root>
  );
}

const meta = preview.meta({
  component: CustomRadioGroup,
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
    selected: {
      selected: true,
    },
    "not selected": {
      selected: false,
    },
  },
};

const CommonStoryTemplate = meta.story({
  render: (args) => (
    <VariantTable
      Component={CustomRadioGroup}
      variantMap={radiomarkVariantMap}
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
