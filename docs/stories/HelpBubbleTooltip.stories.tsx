import preview from "../.storybook/preview";
import { withChromaticParameters } from "@/stories/utils/parameters";
import { IconBellFill } from "@karrotmarket/react-monochrome-icon";
import { helpBubbleVariantMap } from "@seed-design/css/recipes/help-bubble";
import { HelpBubbleTooltipTrigger } from "seed-design/ui/help-bubble-tooltip";
import { SeedThemeDecorator } from "./components/decorator";
import { VariantTable } from "./components/variant-table";

const meta = preview.meta({
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
});
const conditionMap = {
  description: {
    true: { description: "Description" },
    false: { description: undefined },
  },
};

const CommonStoryTemplate = meta.story({
  args: {
    children: <IconBellFill />,
    title: "Title",
    open: true,
    placement: "bottom",
  },
  render: (args, { component }) => (
    <VariantTable
      Component={component!}
      variantMap={helpBubbleVariantMap}
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
