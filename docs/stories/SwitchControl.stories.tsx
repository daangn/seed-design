import type { Meta, StoryObj } from "@storybook/nextjs";

import { SwitchControl } from "seed-design/ui/switch";

import {
  switchControl,
  switchControlVariantMap,
  type SwitchControlVariantProps,
} from "@seed-design/css/recipes/switch-control";
import { SeedThemeDecorator } from "./components/decorator";
import { VariantTable } from "./components/variant-table";
import { createStoryWithParameters } from "@/stories/utils/parameters";
import { Switch } from "@seed-design/react/primitive";

function CustomSwitch(props: SwitchControlVariantProps & Switch.RootProps) {
  const [switchControlVariantProps, otherProps] = switchControl.splitVariantProps(props);

  return (
    <Switch.Root {...otherProps}>
      <SwitchControl {...switchControlVariantProps} />
      <Switch.HiddenInput />
    </Switch.Root>
  );
}

const meta = {
  component: CustomSwitch,
  decorators: [SeedThemeDecorator],
} satisfies Meta<typeof CustomSwitch>;

export default meta;

type Story = StoryObj<typeof meta>;

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

const CommonStoryTemplate: Story = {
  render: (args) => (
    <VariantTable
      Component={meta.component}
      variantMap={switchControlVariantMap}
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
