import preview from "../.storybook/preview";
import { ControlChip } from "seed-design/ui/control-chip";

import { IconBellFill, IconChevronDownFill } from "@karrotmarket/react-monochrome-icon";
import { controlChipVariantMap } from "@seed-design/css/recipes/control-chip";
import { SeedThemeDecorator } from "./components/decorator";
import { VariantTable } from "./components/variant-table";
import { createStoryParameters } from "@/stories/utils/parameters";
import { Count, Icon, PrefixIcon, SuffixIcon } from "@seed-design/react";

const meta = preview.meta({
  component: ControlChip.Toggle,
  decorators: [SeedThemeDecorator],
});
const conditionMap = {
  checked: {
    false: { checked: false },
    true: { checked: true },
  },
  layout: {
    withText: {
      layout: "withText",
      children: (
        <>
          <PrefixIcon svg={<IconBellFill />} />
          Control Chip
          <Count>10</Count>
          <SuffixIcon svg={<IconChevronDownFill />} />
        </>
      ),
    },
    iconOnly: { layout: "iconOnly", children: <Icon svg={<IconBellFill />} /> },
  },
};

const CommonStoryTemplate = meta.story({
  args: {},
  render: (args) => (
    <VariantTable
      Component={ControlChip.Toggle}
      variantMap={controlChipVariantMap}
      conditionMap={conditionMap}
      {...args}
    />
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
