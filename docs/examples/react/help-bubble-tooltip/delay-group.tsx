import {
  IconBellFill,
  IconMagnifyingglassFill,
  IconPencilFill,
  IconPersonCircleFill,
} from "@karrotmarket/react-monochrome-icon";
import { HStack, PrefixIcon } from "@seed-design/react";
import {
  HelpBubbleTooltipDelayGroup,
  HelpBubbleTooltipTrigger,
} from "seed-design/ui/help-bubble-tooltip";
import { ActionButton } from "seed-design/ui/action-button";

export default function HelpBubbleTooltipDelayGroupExample() {
  return (
    <HStack gap="x1">
      <HelpBubbleTooltipDelayGroup>
        <HelpBubbleTooltipTrigger title="동네 가게와 상품을 검색해요" placement="bottom">
          <ActionButton variant="ghost">
            <PrefixIcon svg={<IconMagnifyingglassFill />} />
            검색
          </ActionButton>
        </HelpBubbleTooltipTrigger>
        <HelpBubbleTooltipTrigger title="새 게시글을 작성해요" placement="bottom">
          <ActionButton variant="ghost">
            <PrefixIcon svg={<IconPencilFill />} />
            글쓰기
          </ActionButton>
        </HelpBubbleTooltipTrigger>
        <HelpBubbleTooltipTrigger title="받은 알림을 확인해요" placement="bottom">
          <ActionButton variant="ghost">
            <PrefixIcon svg={<IconBellFill />} />
            알림
          </ActionButton>
        </HelpBubbleTooltipTrigger>
        <HelpBubbleTooltipTrigger title="내 프로필로 이동해요" placement="bottom">
          <ActionButton variant="ghost">
            <PrefixIcon svg={<IconPersonCircleFill />} />
            프로필
          </ActionButton>
        </HelpBubbleTooltipTrigger>
      </HelpBubbleTooltipDelayGroup>
    </HStack>
  );
}
