import type { Meta, StoryObj } from "@storybook/nextjs";

import { Switchmark } from "seed-design/ui/switch";

import {
  switchmark,
  switchmarkVariantMap,
  type SwitchmarkVariantProps,
} from "@ride-developer/css/recipes/switchmark";
import { SeedThemeDecorator } from "./components/decorator";
import { VariantTable } from "./components/variant-table";
import { createStoryWithParameters } from "@/stories/utils/parameters";
import { Switch } from "@ride-developer/react/primitive";

function CustomSwitch(props: SwitchmarkVariantProps & Switch.RootProps) {
  const [switchmarkVariantProps, otherProps] = switchmark.splitVariantProps(props);

  return (
    <Switch.Root {...otherProps}>
      <Switchmark {...switchmarkVariantProps} />
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
      variantMap={switchmarkVariantMap}
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
