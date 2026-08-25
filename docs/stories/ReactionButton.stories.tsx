import preview from "../.storybook/preview";
import { ReactionButton } from "seed-design/ui/reaction-button";

import { IconBellFill } from "@karrotmarket/react-monochrome-icon";
import { reactionButtonVariantMap } from "@seed-design/css/recipes/reaction-button";
import { SeedThemeDecorator } from "./components/decorator";
import { VariantTable } from "./components/variant-table";
import { withChromaticParameters } from "@/stories/utils/parameters";
import { Count, PrefixIcon } from "@seed-design/react";

const meta = preview.meta({
  component: ReactionButton,
  decorators: [SeedThemeDecorator],
});
const conditionMap = {
  disabled: {
    false: { disabled: false },
    true: { disabled: true },
  },
  loading: {
    false: { loading: false },
    true: { loading: true },
  },
  pressed: {
    false: {
      pressed: false,
      children: (
        <>
          <PrefixIcon svg={<IconBellFill />} />
          미선택
          <Count>1</Count>
        </>
      ),
    },
    true: {
      pressed: true,
      children: (
        <>
          <PrefixIcon svg={<IconBellFill />} />
          선택됨
          <Count>1</Count>
        </>
      ),
    },
  },
};

const CommonStoryTemplate = meta.story({
  args: {},
  render: (args, { component }) => (
    <VariantTable
      Component={component!}
      variantMap={reactionButtonVariantMap}
      conditionMap={conditionMap}
      {...args}
    />
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
