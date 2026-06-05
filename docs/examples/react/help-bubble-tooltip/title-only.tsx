import { IconGiftFill } from "@karrotmarket/react-monochrome-icon";
import { Icon } from "@seed-design/react";
import { HelpBubbleTooltipTrigger } from "seed-design/ui/help-bubble-tooltip";
import { ActionButton } from "seed-design/ui/action-button";

export default function HelpBubbleTooltipTitleOnly() {
  return (
    <HelpBubbleTooltipTrigger title="Title Only">
      <ActionButton variant="ghost" size="small" layout="iconOnly" aria-label="도움말">
        <Icon svg={<IconGiftFill />} />
      </ActionButton>
    </HelpBubbleTooltipTrigger>
  );
}
