import { IconClockFill } from "@karrotmarket/react-monochrome-icon";
import { HStack, Icon } from "@seed-design/react";
import { HelpBubbleTooltipTrigger } from "seed-design/ui/help-bubble-tooltip";
import { ActionButton } from "seed-design/ui/action-button";

export default function HelpBubbleTooltipDelay() {
  return (
    <HStack gap="x16">
      <HelpBubbleTooltipTrigger
        title="기본값: openDelay 200ms, closeDelay 100ms"
        placement="bottom"
      >
        <ActionButton variant="ghost" size="small" layout="iconOnly" aria-label="기본 지연">
          <Icon svg={<IconClockFill />} />
        </ActionButton>
      </HelpBubbleTooltipTrigger>
      <HelpBubbleTooltipTrigger
        openDelay={0}
        closeDelay={0}
        title="openDelay={0}, closeDelay={0} — 지연 없이 즉시 열고 닫습니다."
        placement="bottom"
      >
        <ActionButton variant="ghost" size="small" layout="iconOnly" aria-label="지연 없음">
          <Icon svg={<IconClockFill />} />
        </ActionButton>
      </HelpBubbleTooltipTrigger>
    </HStack>
  );
}
