import type { Meta, StoryObj } from "@storybook/nextjs";

import { SwitchMark } from "seed-design/ui/switch";

import {
  switchMark,
  switchMarkVariantMap,
  type SwitchMarkVariantProps,
} from "@seed-design/css/recipes/switch-mark";
import { SeedThemeDecorator } from "./components/decorator";
import { VariantTable } from "./components/variant-table";
import { createStoryWithParameters } from "@/stories/utils/parameters";
import { Switch } from "@seed-design/react/primitive";

function CustomSwitch(props: SwitchMarkVariantProps & Switch.RootProps) {
  const [switchMarkVariantProps, otherProps] = switchMark.splitVariantProps(props);

  return (
    <Switch.Root {...otherProps}>
      <SwitchMark {...switchMarkVariantProps} />
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
      variantMap={switchMarkVariantMap}
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
