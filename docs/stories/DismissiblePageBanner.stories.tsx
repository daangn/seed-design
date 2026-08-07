import preview from "../.storybook/preview";
import { DismissiblePageBanner } from "seed-design/ui/page-banner";

import { pageBannerVariantMap } from "@seed-design/css/recipes/page-banner";
import { VariantTable } from "./components/variant-table";
import { IconBellFill } from "@karrotmarket/react-monochrome-icon";
import { SeedThemeDecorator } from "./components/decorator";
import { createStoryParameters } from "@/stories/utils/parameters";

const meta = preview.meta({
  component: DismissiblePageBanner,
  decorators: [SeedThemeDecorator],
});
const CommonStoryTemplate = meta.story({
  args: {
    title: "enim consectetur",
    description:
      "Ex do aliqua est non ea adipisicing nostrud. Exercitation ea mollit sunt magna quis quis exercitation.",
    prefixIcon: <IconBellFill />,
  },
  render: (args) => (
    <VariantTable Component={DismissiblePageBanner} variantMap={pageBannerVariantMap} {...args} />
  ),
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
