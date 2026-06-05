import { IconSparkle2 } from "@karrotmarket/react-multicolor-icon";
import { Icon } from "@seed-design/react";
import { HelpBubbleTooltipTrigger } from "seed-design/ui/help-bubble-tooltip";

export default function HelpBubbleTooltipTitleOnly() {
  return (
    <HelpBubbleTooltipTrigger title="Title Only">
      <Icon svg={<IconSparkle2 />} />
    </HelpBubbleTooltipTrigger>
  );
}
