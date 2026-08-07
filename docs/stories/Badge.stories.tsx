import preview from "../.storybook/preview";
import { Badge } from "@seed-design/react";

import { badgeVariantMap } from "@seed-design/css/recipes/badge";
import { VariantTable } from "./components/variant-table";
import { SeedThemeDecorator } from "./components/decorator";
import { createStoryParameters } from "@/stories/utils/parameters";

const meta = preview.meta({
  component: Badge,
  decorators: [SeedThemeDecorator],
});
const CommonStoryTemplate = meta.story({
  args: {
    children: "뱃지 내용은 길지 않은 것이 가장 좋겠지만 길어지는 경우 ellipsis 처리합니다.",
  },
  render: (args) => <VariantTable Component={Badge} variantMap={badgeVariantMap} {...args} />,
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
