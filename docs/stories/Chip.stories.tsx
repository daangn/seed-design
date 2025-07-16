import type { Meta, StoryObj } from "@storybook/nextjs";

import { Chip } from "seed-design/ui/chip";

import { IconBellFill, IconChevronDownFill } from "@karrotmarket/react-monochrome-icon";
import { chipVariantMap } from "@seed-design/css/recipes/chip";
import { SeedThemeDecorator } from "./components/decorator";
import { VariantTable } from "./components/variant-table";
import { createStoryWithParameters } from "@/stories/utils/parameters";
import { Count, Icon, PrefixIcon, SuffixIcon } from "@seed-design/react";

const meta = {
  component: Chip.Toggle,
  decorators: [SeedThemeDecorator],
} satisfies Meta<typeof Chip.Toggle>;

export default meta;

type Story = StoryObj<typeof meta>;

const conditionMap = {
  disabled: {
    false: { disabled: false },
    true: { disabled: true },
  },
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
          Chip
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
      variantMap={chipVariantMap}
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
