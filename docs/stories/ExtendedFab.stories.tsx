import preview from "../.storybook/preview";
import { ExtendedFab } from "@seed-design/react";

import { IconBellFill } from "@karrotmarket/react-monochrome-icon";
import { extendedFabVariantMap } from "@seed-design/css/recipes/extended-fab";
import { SeedThemeDecorator } from "./components/decorator";
import { VariantTable } from "./components/variant-table";
import { withChromaticParameters } from "@/stories/utils/parameters";
import { PrefixIcon } from "@seed-design/react";

const meta = preview.meta({
  component: ExtendedFab,
  decorators: [SeedThemeDecorator],
});
const CommonStoryTemplate = meta.story({
  args: {
    children: (
      <>
        <PrefixIcon svg={<IconBellFill />} />
        라벨
      </>
    ),
  },
  render: (args, { component }) => (
    <VariantTable Component={component!} variantMap={extendedFabVariantMap} {...args} />
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
