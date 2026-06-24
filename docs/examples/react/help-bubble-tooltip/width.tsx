import { HStack } from "@seed-design/react";
import { HelpBubbleTooltipTrigger } from "seed-design/ui/help-bubble-tooltip";
import { ActionButton } from "seed-design/ui/action-button";

const TITLE =
  "Pariatur aliqua commodo eu Lorem minim anim. Lorem ipsum voluptate eu duis eiusmod consequat.";

const WIDTHS = ["200px", "300px", "unset"] as const;

export default function HelpBubbleTooltipWidth() {
  return (
    <HStack gap="x16" p="x10">
      {WIDTHS.map((width) => (
        <HelpBubbleTooltipTrigger
          key={width}
          title={TITLE}
          placement="bottom"
          contentProps={{ style: { width } }}
        >
          <ActionButton variant="ghost" size="small">
            {width}
          </ActionButton>
        </HelpBubbleTooltipTrigger>
      ))}
    </HStack>
  );
}
