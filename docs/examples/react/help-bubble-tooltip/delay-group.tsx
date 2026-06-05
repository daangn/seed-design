import {
  IconBellLine,
  IconMagnifyingglassLine,
  IconPencilLine,
  IconPersonCircleLine,
} from "@karrotmarket/react-monochrome-icon";
import { HStack, Icon } from "@seed-design/react";
import {
  HelpBubbleTooltipDelayGroup,
  HelpBubbleTooltipTrigger,
} from "seed-design/ui/help-bubble-tooltip";
import { ActionButton } from "seed-design/ui/action-button";

export default function HelpBubbleTooltipDelayGroupExample() {
  return (
    <HStack gap="x1">
      <HelpBubbleTooltipDelayGroup>
        <HelpBubbleTooltipTrigger title="검색" placement="bottom">
          <ActionButton variant="ghost" layout="iconOnly" aria-label="검색">
            <Icon svg={<IconMagnifyingglassLine />} />
          </ActionButton>
        </HelpBubbleTooltipTrigger>
        <HelpBubbleTooltipTrigger title="글쓰기" placement="bottom">
          <ActionButton variant="ghost" layout="iconOnly" aria-label="글쓰기">
            <Icon svg={<IconPencilLine />} />
          </ActionButton>
        </HelpBubbleTooltipTrigger>
        <HelpBubbleTooltipTrigger title="알림" placement="bottom">
          <ActionButton variant="ghost" layout="iconOnly" aria-label="알림">
            <Icon svg={<IconBellLine />} />
          </ActionButton>
        </HelpBubbleTooltipTrigger>
        <HelpBubbleTooltipTrigger title="프로필" placement="bottom">
          <ActionButton variant="ghost" layout="iconOnly" aria-label="프로필">
            <Icon svg={<IconPersonCircleLine />} />
          </ActionButton>
        </HelpBubbleTooltipTrigger>
      </HelpBubbleTooltipDelayGroup>
    </HStack>
  );
}
