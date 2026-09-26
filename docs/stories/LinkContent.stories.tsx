import preview from "../.storybook/preview";
import { LinkContent } from "@seed-design/react";

import { withVisualTestParameters } from "@/stories/utils/parameters";
import { IconChevronRightLine } from "@karrotmarket/react-monochrome-icon";
import { linkContentVariantMap } from "@seed-design/css/recipes/link-content";
import { SuffixIcon } from "@seed-design/react";
import { SeedThemeDecorator } from "./components/decorator";
import { VariantTable } from "./components/variant-table";

const meta = preview.meta({
  component: LinkContent,
  decorators: [SeedThemeDecorator],
});
const conditionMap = {
  disabled: {
    false: { disabled: false },
    true: { disabled: true },
  },
};

const CommonStoryTemplate = meta.story({
  args: {
    children: (
      <LinkContent>
        더보기
        <SuffixIcon svg={<IconChevronRightLine />} />
      </LinkContent>
    ),
  },
  render: (args, { component }) => (
    <VariantTable
      Component={component!}
      variantMap={linkContentVariantMap}
      conditionMap={conditionMap}
      {...args}
    />
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
