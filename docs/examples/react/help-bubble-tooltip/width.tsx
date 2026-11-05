import { HStack } from "@seed-design/react";
import { HelpBubbleTooltipTrigger } from "seed-design/ui/help-bubble-tooltip";
import { ActionButton } from "seed-design/ui/action-button";

const TITLE =
  "Pariatur aliqua commodo eu Lorem minim anim. Lorem ipsum voluptate eu duis eiusmod consequat.";

const MAX_WIDTHS = ["200px", "400px", "none"] as const;

export default function HelpBubbleTooltipWidth() {
  return (
    <HStack gap="x16" p="x10">
      {MAX_WIDTHS.map((maxWidth) => (
        <HelpBubbleTooltipTrigger
          key={maxWidth}
          title={TITLE}
          placement="bottom"
          contentProps={{ maxWidth }}
        >
          <ActionButton variant="ghost" size="small">
            {maxWidth}
          </ActionButton>
        </HelpBubbleTooltipTrigger>
      ))}
    </HStack>
  );
}
