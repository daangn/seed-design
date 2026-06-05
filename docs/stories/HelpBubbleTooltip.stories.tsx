import type { Meta, StoryObj } from "@storybook/nextjs";

import { createStoryWithParameters } from "@/stories/utils/parameters";
import { IconBellFill } from "@karrotmarket/react-monochrome-icon";
import { helpBubbleVariantMap } from "@seed-design/css/recipes/help-bubble";
import { HelpBubbleTooltipTrigger } from "seed-design/ui/help-bubble-tooltip";
import { SeedThemeDecorator } from "./components/decorator";
import { VariantTable } from "./components/variant-table";

const meta = {
  component: HelpBubbleTooltipTrigger,
  decorators: [
    (Story) => (
      <>
        <style>{`
          .help-bubble-tooltip-story td {
            padding: 40px 16px !important;
          }
        `}</style>
        <div className="help-bubble-tooltip-story">
          <Story />
        </div>
      </>
    ),
    SeedThemeDecorator,
  ],
} satisfies Meta<typeof HelpBubbleTooltipTrigger>;

export default meta;

type Story = StoryObj<typeof meta>;

const conditionMap = {
  description: {
    true: { description: "Description" },
    false: { description: undefined },
  },
};

const CommonStoryTemplate: Story = {
  args: {
    children: <IconBellFill />,
    title: "Title",
    open: true,
    placement: "bottom",
  },
  render: (args) => (
    <VariantTable
      Component={meta.component}
      variantMap={helpBubbleVariantMap}
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
