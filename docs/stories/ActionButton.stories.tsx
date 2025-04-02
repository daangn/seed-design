import type { Meta, StoryObj } from "@storybook/react";

import { ActionButton } from "seed-design/ui/action-button";

import { createStoryWithParameters } from "@/stories/utils/parameters";
import { IconBellFill, IconChevronRightFill } from "@karrotmarket/react-monochrome-icon";
import { actionButtonVariantMap } from "@seed-design/css/recipes/action-button";
import { PrefixIcon, SuffixIcon, Icon } from "@seed-design/react";
import { SeedThemeDecorator } from "./components/decorator";
import { VariantTable } from "./components/variant-table";

const meta = {
  component: ActionButton,
  decorators: [SeedThemeDecorator],
} satisfies Meta<typeof ActionButton>;

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
  layout: {
    textOnly: { layout: "withText", children: "Action Button" },
    iconFirst: {
      layout: "withText",
      children: (
        <>
          <PrefixIcon svg={<IconBellFill />} />
          Action Button
        </>
      ),
    },
    iconLast: {
      layout: "withText",
      children: (
        <>
          Action Button
          <SuffixIcon svg={<IconChevronRightFill />} />
        </>
      ),
    },
    iconOnly: { layout: "iconOnly", children: <Icon svg={<IconBellFill />} /> },
  },
};

const { size, ...variantMapWithoutSize } = actionButtonVariantMap;

const XSmallTemplate: Story = {
  args: {
    size: "xsmall",
  },
  render: (args) => (
    <VariantTable
      Component={meta.component}
      variantMap={variantMapWithoutSize}
      conditionMap={conditionMap}
      {...args}
    />
  ),
};

const SmallTemplate: Story = {
  args: {
    size: "small",
  },
  render: (args) => (
    <VariantTable
      Component={meta.component}
      variantMap={variantMapWithoutSize}
      conditionMap={conditionMap}
      {...args}
    />
  ),
};

const MediumTemplate: Story = {
  args: {
    size: "medium",
  },
  render: (args) => (
    <VariantTable
      Component={meta.component}
      variantMap={variantMapWithoutSize}
      conditionMap={conditionMap}
      {...args}
    />
  ),
};

const LargeTemplate: Story = {
  args: {
    size: "large",
  },
  render: (args) => (
    <VariantTable
      Component={meta.component}
      variantMap={variantMapWithoutSize}
      conditionMap={conditionMap}
      {...args}
    />
  ),
};

export const XSmallLightTheme = XSmallTemplate;
export const XSmallDarkTheme = createStoryWithParameters({
  ...XSmallTemplate,
  parameters: { theme: "dark" },
});
export const XSmallFontScalingExtraSmall = createStoryWithParameters({
  ...XSmallTemplate,
  parameters: { fontScale: "Extra Small" },
});
export const XSmallFontScalingExtraExtraExtraLarge = createStoryWithParameters({
  ...XSmallTemplate,
  parameters: { fontScale: "Extra Extra Extra Large" },
});

export const SmallLightTheme = SmallTemplate;
export const SmallDarkTheme = createStoryWithParameters({
  ...SmallTemplate,
  parameters: { theme: "dark" },
});
export const SmallFontScalingExtraSmall = createStoryWithParameters({
  ...SmallTemplate,
  parameters: { fontScale: "Extra Small" },
});
export const SmallFontScalingExtraExtraExtraLarge = createStoryWithParameters({
  ...SmallTemplate,
  parameters: { fontScale: "Extra Extra Extra Large" },
});

export const MediumLightTheme = MediumTemplate;
export const MediumDarkTheme = createStoryWithParameters({
  ...MediumTemplate,
  parameters: { theme: "dark" },
});
export const MediumFontScalingExtraSmall = createStoryWithParameters({
  ...MediumTemplate,
  parameters: { fontScale: "Extra Small" },
});
export const MediumFontScalingExtraExtraExtraLarge = createStoryWithParameters({
  ...MediumTemplate,
  parameters: { fontScale: "Extra Extra Extra Large" },
});

export const LargeLightTheme = LargeTemplate;
export const LargeDarkTheme = createStoryWithParameters({
  ...LargeTemplate,
  parameters: { theme: "dark" },
});
export const LargeFontScalingExtraSmall = createStoryWithParameters({
  ...LargeTemplate,
  parameters: { fontScale: "Extra Small" },
});
export const LargeFontScalingExtraExtraExtraLarge = createStoryWithParameters({
  ...LargeTemplate,
  parameters: { fontScale: "Extra Extra Extra Large" },
});
