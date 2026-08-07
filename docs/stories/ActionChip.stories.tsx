import preview from "../.storybook/preview";
import { ActionChip } from "@seed-design/react";

import { actionChipVariantMap } from "@seed-design/css/recipes/action-chip";
import { VariantTable } from "./components/variant-table";
import { IconBellFill, IconChevronDownFill } from "@karrotmarket/react-monochrome-icon";
import { SeedThemeDecorator } from "./components/decorator";
import { createStoryParameters } from "@/stories/utils/parameters";
import { Count, Icon, PrefixIcon, SuffixIcon } from "@seed-design/react";

const meta = preview.meta({
  component: ActionChip,
  decorators: [SeedThemeDecorator],
});
const conditionMap = {
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
      Component={ActionChip}
      variantMap={actionChipVariantMap}
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
