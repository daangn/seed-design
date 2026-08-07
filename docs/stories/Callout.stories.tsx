import preview from "../.storybook/preview";
import { Callout } from "seed-design/ui/callout";

import { calloutVariantMap } from "@seed-design/css/recipes/callout";
import { VariantTable } from "./components/variant-table";
import { IconBellFill } from "@karrotmarket/react-monochrome-icon";
import { SeedThemeDecorator } from "./components/decorator";
import { createStoryParameters } from "@/stories/utils/parameters";

const meta = preview.meta({
  component: Callout,
  decorators: [SeedThemeDecorator],
});
const CommonStoryTemplate = meta.story({
  args: {
    title: "새로운 기능",
    description: "Magna id laboris excepteur tempor duis duis voluptate voluptate non.",
    linkProps: { children: "자세히 보기" },
    prefixIcon: <IconBellFill />,
  },
  render: (args) => <VariantTable Component={Callout} variantMap={calloutVariantMap} {...args} />,
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
