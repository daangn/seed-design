import { IconPencilLine } from "@karrotmarket/react-monochrome-icon";
import { Icon } from "@seed-design/react";
import { HelpBubbleTooltipTrigger } from "seed-design/ui/help-bubble-tooltip";
import { ActionButton } from "seed-design/ui/action-button";

export default function HelpBubbleTooltipDisabled() {
  return (
    <HelpBubbleTooltipTrigger title="권한이 없어 사용할 수 없어요." placement="bottom">
      <span tabIndex={0} style={{ display: "inline-flex" }}>
        <ActionButton
          variant="ghost"
          size="small"
          layout="iconOnly"
          aria-label="글쓰기"
          disabled
          style={{ pointerEvents: "none" }}
        >
          <Icon svg={<IconPencilLine />} />
        </ActionButton>
      </span>
    </HelpBubbleTooltipTrigger>
  );
}
