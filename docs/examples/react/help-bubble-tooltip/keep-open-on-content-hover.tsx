import { IconILowercaseSerifCircleLine } from "@karrotmarket/react-monochrome-icon";
import { HStack, Icon } from "@seed-design/react";
import { HelpBubbleTooltipTrigger } from "seed-design/ui/help-bubble-tooltip";
import { ActionButton } from "seed-design/ui/action-button";

export default function HelpBubbleTooltipKeepOpenOnContentHover() {
  return (
    <HStack gap="x16">
      <HelpBubbleTooltipTrigger
        title="기본 동작"
        description="버블 위로 포인터를 옮기면 닫혀요."
        placement="bottom"
      >
        <ActionButton variant="ghost" size="small" layout="iconOnly" aria-label="기본 동작">
          <Icon svg={<IconILowercaseSerifCircleLine />} />
        </ActionButton>
      </HelpBubbleTooltipTrigger>
      <HelpBubbleTooltipTrigger
        keepOpenOnContentHover
        title="keepOpenOnContentHover"
        description="버블 위로 포인터를 옮겨도 닫히지 않아 내용을 천천히 읽을 수 있어요."
        placement="bottom"
      >
        <ActionButton
          variant="ghost"
          size="small"
          layout="iconOnly"
          aria-label="keepOpenOnContentHover"
        >
          <Icon svg={<IconILowercaseSerifCircleLine />} />
        </ActionButton>
      </HelpBubbleTooltipTrigger>
    </HStack>
  );
}
