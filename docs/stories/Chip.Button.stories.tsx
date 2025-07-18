import type { Meta, StoryObj } from "@storybook/nextjs";

import { Chip } from "seed-design/ui/chip";

import { createStoryWithParameters } from "@/stories/utils/parameters";
import { IconHeartFill } from "@karrotmarket/react-monochrome-icon";
import { chipVariantMap } from "@seed-design/css/recipes/chip";
import { Icon } from "@seed-design/react";
import { SeedThemeDecorator } from "./components/decorator";
import { VariantTable } from "./components/variant-table";

const meta = {
  component: Chip.Button,
  decorators: [SeedThemeDecorator],
} satisfies Meta<typeof Chip.Button>;

export default meta;

type Story = StoryObj<typeof meta>;

const conditionMap = {
  disabled: {
    false: { disabled: false },
    true: { disabled: true },
  },
  layout: {
    withText: {
      children: (
        <>
          <Chip.PrefixIcon>
            <Icon svg={<IconHeartFill />} />
          </Chip.PrefixIcon>
          <Chip.Label>With Icon Button</Chip.Label>
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
