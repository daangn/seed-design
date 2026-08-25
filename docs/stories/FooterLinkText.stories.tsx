import preview from "../.storybook/preview";
import { FooterLinkText, SuffixIcon } from "@seed-design/react";

import { withVisualTestParameters } from "@/stories/utils/parameters";
import { IconArrowUpRightLine } from "@karrotmarket/react-monochrome-icon";
import { footerVariantMap } from "@seed-design/css/recipes/footer";
import { SeedThemeDecorator } from "./components/decorator";
import { VariantTable } from "./components/variant-table";

const meta = preview.meta({
  component: FooterLinkText,
  decorators: [SeedThemeDecorator],
});
const CommonStoryTemplate = meta.story({
  args: {
    children: (
      <>
        이용약관
        <SuffixIcon svg={<IconArrowUpRightLine />} />
      </>
    ),
  },
  render: (args, { component }) => (
    <VariantTable Component={component!} variantMap={footerVariantMap} {...args} />
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
