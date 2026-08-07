import preview from "../.storybook/preview";
import { ActionButton } from "seed-design/ui/action-button";

import { createStoryParameters } from "@/stories/utils/parameters";
import { IconBellFill, IconChevronRightFill } from "@karrotmarket/react-monochrome-icon";
import { actionButtonVariantMap } from "@seed-design/css/recipes/action-button";
import { PrefixIcon, SuffixIcon, Icon } from "@seed-design/react";
import { SeedThemeDecorator } from "./components/decorator";
import { VariantTable } from "./components/variant-table";

const meta = preview.meta({
  component: ActionButton,
  decorators: [SeedThemeDecorator],
});
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

const XSmallTemplate = meta.story({
  args: {
    size: "xsmall",
  },
  render: (args) => (
    <VariantTable
      Component={ActionButton}
      variantMap={variantMapWithoutSize}
      conditionMap={conditionMap}
      {...args}
    />
  ),
});

const SmallTemplate = meta.story({
  args: {
    size: "small",
  },
  render: (args) => (
    <VariantTable
      Component={ActionButton}
      variantMap={variantMapWithoutSize}
      conditionMap={conditionMap}
      {...args}
    />
  ),
});

const MediumTemplate = meta.story({
  args: {
    size: "medium",
  },
  render: (args) => (
    <VariantTable
      Component={ActionButton}
      variantMap={variantMapWithoutSize}
      conditionMap={conditionMap}
      {...args}
    />
  ),
});

const LargeTemplate = meta.story({
  args: {
    size: "large",
  },
  render: (args) => (
    <VariantTable
      Component={ActionButton}
      variantMap={variantMapWithoutSize}
      conditionMap={conditionMap}
      {...args}
    />
  ),
});

export const XSmallLightTheme = XSmallTemplate.extend({});
export const XSmallDarkTheme = XSmallTemplate.extend({
  parameters: createStoryParameters({ theme: "dark" }),
});
export const XSmallFontScalingExtraSmall = XSmallTemplate.extend({
  parameters: createStoryParameters({ fontScale: "Extra Small" }),
});
export const XSmallFontScalingExtraExtraExtraLarge = XSmallTemplate.extend({
  parameters: createStoryParameters({ fontScale: "Extra Extra Extra Large" }),
});

export const SmallLightTheme = SmallTemplate.extend({});
export const SmallDarkTheme = SmallTemplate.extend({
  parameters: createStoryParameters({ theme: "dark" }),
});
export const SmallFontScalingExtraSmall = SmallTemplate.extend({
  parameters: createStoryParameters({ fontScale: "Extra Small" }),
});
export const SmallFontScalingExtraExtraExtraLarge = SmallTemplate.extend({
  parameters: createStoryParameters({ fontScale: "Extra Extra Extra Large" }),
});

export const MediumLightTheme = MediumTemplate.extend({});
export const MediumDarkTheme = MediumTemplate.extend({
  parameters: createStoryParameters({ theme: "dark" }),
});
export const MediumFontScalingExtraSmall = MediumTemplate.extend({
  parameters: createStoryParameters({ fontScale: "Extra Small" }),
});
export const MediumFontScalingExtraExtraExtraLarge = MediumTemplate.extend({
  parameters: createStoryParameters({ fontScale: "Extra Extra Extra Large" }),
});

export const LargeLightTheme = LargeTemplate.extend({});
export const LargeDarkTheme = LargeTemplate.extend({
  parameters: createStoryParameters({ theme: "dark" }),
});
export const LargeFontScalingExtraSmall = LargeTemplate.extend({
  parameters: createStoryParameters({ fontScale: "Extra Small" }),
});
export const LargeFontScalingExtraExtraExtraLarge = LargeTemplate.extend({
  parameters: createStoryParameters({ fontScale: "Extra Extra Extra Large" }),
});
