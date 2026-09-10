import preview from "../.storybook/preview";
import { Skeleton } from "@seed-design/react";

import { skeletonVariantMap } from "@seed-design/css/recipes/skeleton";
import { VariantTable } from "./components/variant-table";
import { SeedThemeDecorator } from "./components/decorator";
import { withChromaticParameters } from "@/stories/utils/parameters";

const meta = preview.meta({
  component: Skeleton,
  decorators: [SeedThemeDecorator],
});

const conditionMap = {
  height: {
    "50px": { height: "50px" },
    x4: { height: "x4" },
    "lineHeight.t4": { height: "lineHeight.t4" },
    "lineHeight.t7": { height: "lineHeight.t7" },
    "lineHeight.t4Static": { height: "lineHeight.t4Static" },
  },
};

const CommonStoryTemplate = meta.story({
  args: {
    width: "100%",
  },
  render: (args, { component }) => (
    <VariantTable
      Component={component!}
      variantMap={skeletonVariantMap}
      conditionMap={conditionMap}
      {...args}
    />
  ),
});

export const LightTheme = CommonStoryTemplate.extend({});

export const DarkTheme = CommonStoryTemplate.extend({
  parameters: withChromaticParameters({ theme: "dark" }),
});

export const FontScalingExtraSmall = CommonStoryTemplate.extend({
  parameters: withChromaticParameters({ fontScale: "Extra Small" }),
});

export const FontScalingExtraExtraExtraLarge = CommonStoryTemplate.extend({
  parameters: withChromaticParameters({ fontScale: "Extra Extra Extra Large" }),
});
