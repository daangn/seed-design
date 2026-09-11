import preview from "../.storybook/preview";
import { ToggleButton } from "seed-design/ui/toggle-button";

import { IconBellFill, IconChevronRightFill } from "@karrotmarket/react-monochrome-icon";
import { toggleButtonVariantMap } from "@seed-design/css/recipes/toggle-button";
import { SeedThemeDecorator } from "./components/decorator";
import { VariantTable } from "./components/variant-table";
import { withVisualTestParameters } from "@/stories/utils/parameters";
import { PrefixIcon, SuffixIcon } from "@seed-design/react";

const meta = preview.meta({
  component: ToggleButton,
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
          <SuffixIcon svg={<IconChevronRightFill />} />
        </>
      ),
    },
    true: {
      pressed: true,
      children: (
        <>
          <PrefixIcon svg={<IconBellFill />} />
          선택됨
          <SuffixIcon svg={<IconChevronRightFill />} />
        </>
      ),
    },
  },
};

const CommonStoryTemplate = meta.story({
  render: (args, { component }) => (
    <VariantTable
      Component={component!}
      variantMap={toggleButtonVariantMap}
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
