import preview from "../.storybook/preview";
import { Skeleton } from "@seed-design/react";

import { skeletonVariantMap } from "@seed-design/css/recipes/skeleton";
import { VariantTable } from "./components/variant-table";
import { SeedThemeDecorator } from "./components/decorator";
import { createStoryParameters } from "@/stories/utils/parameters";

const meta = preview.meta({
  component: Skeleton,
  decorators: [SeedThemeDecorator],
});
const CommonStoryTemplate = meta.story({
  args: {
    width: "100%",
    height: "50px",
  },
  render: (args) => <VariantTable Component={Skeleton} variantMap={skeletonVariantMap} {...args} />,
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
