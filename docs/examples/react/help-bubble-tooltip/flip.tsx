import { IconHeartFill } from "@karrotmarket/react-monochrome-icon";
import { Icon } from "@seed-design/react";
import { HelpBubbleTooltipTrigger } from "seed-design/ui/help-bubble-tooltip";
import { ActionButton } from "seed-design/ui/action-button";

export default function HelpBubbleTooltipFlip() {
  return (
    <HelpBubbleTooltipTrigger
      flip={false}
      title="Flip"
      description="Flip을 끄면 화면 경계에서 방향이 바뀌지 않아요."
    >
      <ActionButton variant="ghost" size="small" layout="iconOnly" aria-label="도움말">
        <Icon svg={<IconHeartFill />} />
      </ActionButton>
    </HelpBubbleTooltipTrigger>
  );
}
