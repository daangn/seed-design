import type { Meta, StoryObj } from "@storybook/react";

import { ToggleButton } from "seed-design/ui/toggle-button";

import { IconBellFill, IconChevronRightFill } from "@karrotmarket/react-monochrome-icon";
import { toggleButtonVariantMap } from "@seed-design/css/recipes/toggle-button";
import { SeedThemeDecorator } from "./components/decorator";
import { VariantTable } from "./components/variant-table";
import { createStoryWithParameters } from "@/stories/utils/parameters";
import { PrefixIcon, SuffixIcon } from "@seed-design/react";

const meta = {
  component: ToggleButton,
  decorators: [SeedThemeDecorator],
} satisfies Meta<typeof ToggleButton>;

export default meta;

type Story = StoryObj<typeof meta>;

const conditionMap = {
  disabled: {
    false: { disabled: false },
    true: { disabled: true },
  },
  loading: {
    false: { loading: false },
    true: { loading: true },
  },
  pressed: {
    false: {
      pressed: false,
      children: (
        <>
          <PrefixIcon svg={<IconBellFill />} />
          미선택
          <SuffixIcon svg={<IconChevronRightFill />} />
        </>
      ),
    },
    true: {
      pressed: true,
      children: (
        <>
          <PrefixIcon svg={<IconBellFill />} />
          선택됨
          <SuffixIcon svg={<IconChevronRightFill />} />
        </>
      ),
    },
  },
};

const CommonStoryTemplate: Story = {
  render: (args) => (
    <VariantTable
      Component={meta.component}
      variantMap={toggleButtonVariantMap}
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
