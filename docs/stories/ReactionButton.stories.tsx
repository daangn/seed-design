import type { Meta, StoryObj } from "@storybook/nextjs";

import { ReactionButton } from "seed-design/ui/reaction-button";

import { IconBellFill, IconChevronRightFill } from "@karrotmarket/react-monochrome-icon";
import { reactionButtonVariantMap } from "@seed-design/css/recipes/reaction-button";
import { SeedThemeDecorator } from "./components/decorator";
import { VariantTable } from "./components/variant-table";
import { createStoryWithParameters } from "@/stories/utils/parameters";
import { Count, PrefixIcon } from "@seed-design/react";

const meta = {
  component: ReactionButton,
  decorators: [SeedThemeDecorator],
} satisfies Meta<typeof ReactionButton>;

export default meta;

type Story = StoryObj<typeof meta>;

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

const CommonStoryTemplate: Story = {
  args: {},
  render: (args) => (
    <VariantTable
      Component={meta.component}
      variantMap={reactionButtonVariantMap}
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
