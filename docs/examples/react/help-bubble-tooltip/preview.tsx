import { IconILowercaseSerifCircleFill } from "@karrotmarket/react-monochrome-icon";
import { Icon } from "@seed-design/react";
import { HelpBubbleTooltipTrigger } from "seed-design/ui/help-bubble-tooltip";
import { ActionButton } from "seed-design/ui/action-button";

export default function HelpBubbleTooltipPreview() {
  return (
    <HelpBubbleTooltipTrigger title="포인터를 올리거나 키보드로 포커스하면 열립니다.">
      <ActionButton variant="ghost" size="small" layout="iconOnly" aria-label="도움말">
        <Icon svg={<IconILowercaseSerifCircleFill />} />
      </ActionButton>
    </HelpBubbleTooltipTrigger>
  );
}
