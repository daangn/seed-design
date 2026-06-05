import { IconILowercaseSerifCircleFill } from "@karrotmarket/react-monochrome-icon";
import { HStack, Icon } from "@seed-design/react";
import { HelpBubbleTooltipTrigger } from "seed-design/ui/help-bubble-tooltip";
import { ActionButton } from "seed-design/ui/action-button";

export default function HelpBubbleTooltipKeepOpenOnContentHover() {
  return (
    <HStack gap="x16">
      <HelpBubbleTooltipTrigger
        title="기본 동작"
        description="포인터를 Help Bubble Tooltip 위로 옮기면 닫혀서, 안의 텍스트를 선택할 수 없어요."
        placement="bottom"
      >
        <ActionButton variant="ghost" size="small" layout="iconOnly" aria-label="도움말">
          <Icon svg={<IconILowercaseSerifCircleFill />} />
        </ActionButton>
      </HelpBubbleTooltipTrigger>
      <HelpBubbleTooltipTrigger
        keepOpenOnContentHover
        title="keepOpenOnContentHover"
        description="포인터를 Help Bubble Tooltip 위로 옮겨도 닫히지 않아, 안의 텍스트를 드래그해 선택할 수 있어요."
        placement="bottom"
      >
        <ActionButton variant="ghost" size="small" layout="iconOnly" aria-label="도움말">
          <Icon svg={<IconILowercaseSerifCircleFill />} />
        </ActionButton>
      </HelpBubbleTooltipTrigger>
    </HStack>
  );
}
