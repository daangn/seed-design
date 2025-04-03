import type { Meta, StoryObj } from "@storybook/react";

import { ActionChip } from "@seed-design/react";

import { actionChipVariantMap } from "@seed-design/css/recipes/action-chip";
import { VariantTable } from "./components/variant-table";
import { IconBellFill, IconChevronDownFill } from "@karrotmarket/react-monochrome-icon";
import { SeedThemeDecorator } from "./components/decorator";
import { createStoryWithParameters } from "@/stories/utils/parameters";
import { Count, Icon, PrefixIcon, SuffixIcon } from "@seed-design/react";

const meta = {
  component: ActionChip,
  decorators: [SeedThemeDecorator],
} satisfies Meta<typeof ActionChip>;

export default meta;

type Story = StoryObj<typeof meta>;

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

const CommonStoryTemplate: Story = {
  args: {},
  render: (args) => (
    <VariantTable
      Component={meta.component}
      variantMap={actionChipVariantMap}
      conditionMap={conditionMap}
      {...args}
    />
  ),
};

export const LightTheme = CommonStoryTemplate;

export const DarkTheme = createStoryWithParameters({
  ...CommonStoryTemplate,
  parameters: { theme: "dark" },
});

export const FontScalingExtraSmall = createStoryWithParameters({
  ...CommonStoryTemplate,
  parameters: { fontScale: "Extra Small" },
});

export const FontScalingExtraExtraExtraLarge = createStoryWithParameters({
  ...CommonStoryTemplate,
  parameters: { fontScale: "Extra Extra Extra Large" },
});
