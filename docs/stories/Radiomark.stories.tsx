import type { Meta, StoryObj } from "@storybook/nextjs";

import { Radiomark } from "seed-design/ui/radio-group";
import {
  radiomark,
  radiomarkVariantMap,
  type RadiomarkVariantProps,
} from "@ride-developer/css/recipes/radiomark";
import { VariantTable } from "./components/variant-table";
import { SeedThemeDecorator } from "./components/decorator";
import { createStoryWithParameters } from "@/stories/utils/parameters";
import { RadioGroup } from "@ride-developer/react/primitive";

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

const meta = {
  component: CustomRadioGroup,
  decorators: [SeedThemeDecorator],
} satisfies Meta<typeof CustomRadioGroup>;

export default meta;

type Story = StoryObj<typeof meta>;

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

const CommonStoryTemplate: Story = {
  render: (args) => (
    <VariantTable
      Component={meta.component}
      variantMap={radiomarkVariantMap}
      conditionMap={conditionMap}
      {...args}
    />
  ),
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
