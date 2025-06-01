import type { Meta, StoryObj } from "@storybook/nextjs";

import { ContextualFloatingButton } from "seed-design/ui/contextual-floating-button";
import { Icon } from "@seed-design/react";

import { createStoryWithParameters } from "@/stories/utils/parameters";
import { IconBellFill } from "@karrotmarket/react-monochrome-icon";
import { contextualFloatingButtonVariantMap } from "@seed-design/css/recipes/contextual-floating-button";
import { PrefixIcon } from "@seed-design/react";
import { SeedThemeDecorator } from "./components/decorator";
import { VariantTable } from "./components/variant-table";

const meta = {
  component: ContextualFloatingButton,
  decorators: [SeedThemeDecorator],
} satisfies Meta<typeof ContextualFloatingButton>;

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
  layout: {
    textOnly: { layout: "withText", children: "알림 설정" },
    iconFirst: {
      layout: "withText",
      children: (
        <>
          <PrefixIcon svg={<IconBellFill />} />
          알림 설정
        </>
      ),
    },
    iconOnly: { layout: "iconOnly", children: <Icon svg={<IconBellFill />} /> },
  },
};

const CommonStoryTemplate: Story = {
  render: (args) => (
    <VariantTable
      Component={meta.component}
      variantMap={contextualFloatingButtonVariantMap}
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
