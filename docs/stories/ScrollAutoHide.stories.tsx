import preview from "../.storybook/preview";
import ScrollAutoHidePreview from "../examples/breeze/scroll-auto-hide/preview";

import { withChromaticParameters } from "@/stories/utils/parameters";
import { SeedThemeDecorator } from "./components/decorator";

const meta = preview.meta({
  component: ScrollAutoHidePreview,
  decorators: [SeedThemeDecorator],
});

const CommonStoryTemplate = meta.story({});

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
