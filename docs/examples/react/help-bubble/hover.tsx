import { IconILowercaseSerifCircleLine } from "@karrotmarket/react-monochrome-icon";
import { Icon } from "@seed-design/react";
import { HelpBubbleTrigger } from "seed-design/ui/help-bubble";
import { ActionButton } from "seed-design/ui/action-button";

export default function HelpBubbleHover() {
  return (
    <HelpBubbleTrigger
      trigger="hover"
      title="Hover trigger"
      description="포인터가 트리거 위에 있을 때만 열립니다."
      placement="right"
    >
      <ActionButton variant="ghost" size="small" layout="iconOnly" aria-label="도움말">
        <Icon svg={<IconILowercaseSerifCircleLine />} />
      </ActionButton>
    </HelpBubbleTrigger>
  );
}
