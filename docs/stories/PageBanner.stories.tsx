import preview from "../.storybook/preview";
import { PageBanner, PageBannerButton } from "seed-design/ui/page-banner";

import { pageBannerVariantMap } from "@seed-design/css/recipes/page-banner";
import { VariantTable } from "./components/variant-table";
import { IconBellFill } from "@karrotmarket/react-monochrome-icon";
import { SeedThemeDecorator } from "./components/decorator";
import { withVisualTestParameters } from "@/stories/utils/parameters";

const meta = preview.meta({
  component: PageBanner,
  decorators: [SeedThemeDecorator],
});
const CommonStoryTemplate = meta.story({
  args: {
    title: "enim consectetur",
    description:
      "Ex do aliqua est non ea adipisicing nostrud. Exercitation ea mollit sunt magna quis quis exercitation.",
    prefixIcon: <IconBellFill />,
    suffix: <PageBannerButton>자세히 보기</PageBannerButton>,
  },
  render: (args, { component }) => (
    <VariantTable Component={component!} variantMap={pageBannerVariantMap} {...args} />
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
