import type { Meta, StoryObj } from "@storybook/nextjs";

import { Checkmark } from "seed-design/ui/checkbox";
import {
  checkmark,
  checkmarkVariantMap,
  type CheckmarkVariantProps,
} from "@ride-developer/css/recipes/checkmark";
import { VariantTable } from "./components/variant-table";
import { SeedThemeDecorator } from "./components/decorator";
import { createStoryWithParameters } from "@/stories/utils/parameters";
import { Checkbox } from "@ride-developer/react/primitive";

function CustomCheckbox(props: CheckmarkVariantProps & Checkbox.RootProps) {
  const [checkmarkVariantProps, otherProps] = checkmark.splitVariantProps(props);

  return (
    <Checkbox.Root {...otherProps}>
      <Checkmark {...checkmarkVariantProps} />
      <Checkbox.HiddenInput />
    </Checkbox.Root>
  );
}

const meta = {
  component: CustomCheckbox,
  decorators: [SeedThemeDecorator],
} satisfies Meta<typeof CustomCheckbox>;

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

const CommonStoryTemplate: Story = {
  render: (args) => (
    <VariantTable
      Component={meta.component}
      variantMap={checkmarkVariantMap}
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
