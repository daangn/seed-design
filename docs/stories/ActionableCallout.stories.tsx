import preview from "../.storybook/preview";
import { ActionableCallout } from "seed-design/ui/callout";

import { calloutVariantMap } from "@seed-design/css/recipes/callout";
import { VariantTable } from "./components/variant-table";
import { SeedThemeDecorator } from "./components/decorator";
import { withVisualTestParameters } from "@/stories/utils/parameters";

const meta = preview.meta({
  component: ActionableCallout,
  decorators: [SeedThemeDecorator],
});
const CommonStoryTemplate = meta.story({
  args: {
    title: "새로운 기능",
    description: "Magna id laboris excepteur tempor duis duis voluptate voluptate non.",
  },
  render: (args, { component }) => (
    <VariantTable Component={component!} variantMap={calloutVariantMap} {...args} />
  ),
});

export const LightTheme = CommonStoryTemplate.extend({});

export const DarkTheme = CommonStoryTemplate.extend({
  parameters: withVisualTestParameters({ theme: "dark" }),
});

export const FontScalingExtraSmall = CommonStoryTemplate.extend({
  parameters: withVisualTestParameters({ fontScale: "Extra Small" }),
});

export const FontScalingExtraExtraExtraLarge = CommonStoryTemplate.extend({
  parameters: withVisualTestParameters({ fontScale: "Extra Extra Extra Large" }),
});
