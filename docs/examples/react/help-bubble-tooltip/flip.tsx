import { IconSparkle2 } from "@karrotmarket/react-multicolor-icon";
import { Icon } from "@seed-design/react";
import { HelpBubbleTooltipTrigger } from "seed-design/ui/help-bubble-tooltip";

export default function HelpBubbleTooltipFlip() {
  return (
    <HelpBubbleTooltipTrigger
      flip={false}
      title="Flip"
      description="Flip을 끄면 화면 경계에서 방향이 바뀌지 않아요."
    >
      <Icon svg={<IconSparkle2 />} />
    </HelpBubbleTooltipTrigger>
  );
}
