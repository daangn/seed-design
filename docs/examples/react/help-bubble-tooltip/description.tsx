import { IconILowercaseSerifCircleFill } from "@karrotmarket/react-monochrome-icon";
import { Icon } from "@seed-design/react";
import { HelpBubbleTooltipTrigger } from "seed-design/ui/help-bubble-tooltip";
import { ActionButton } from "seed-design/ui/action-button";

export default function HelpBubbleTooltipDescription() {
  return (
    <HelpBubbleTooltipTrigger title="제목" description="제목 아래에 부연 설명을 덧붙일 수 있어요.">
      <ActionButton variant="ghost" size="small" layout="iconOnly" aria-label="도움말">
        <Icon svg={<IconILowercaseSerifCircleFill />} />
      </ActionButton>
    </HelpBubbleTooltipTrigger>
  );
}
