import { IconILowercaseSerifCircleFill } from "@karrotmarket/react-monochrome-icon";
import { HelpBubbleTooltipTrigger } from "seed-design/ui/help-bubble-tooltip";
import { ActionButton } from "seed-design/ui/action-button";
import { Icon } from "@seed-design/react";

export default function HelpBubbleHover() {
  return (
    <HelpBubbleTooltipTrigger
      title="포인터를 올리거나 키보드로 포커스하면 열립니다."
      placement="right"
    >
      <ActionButton variant="ghost" size="small" layout="iconOnly" aria-label="도움말">
        <Icon svg={<IconILowercaseSerifCircleFill />} />
      </ActionButton>
    </HelpBubbleTooltipTrigger>
  );
}
