import IconILowercaseSerifCircleLine from "@karrotmarket/react-monochrome-icon/IconILowercaseSerifCircleLine";
import { Icon } from "@seed-design/react";
import { ActionButton } from "seed-design/ui/action-button";
import { HelpBubbleTrigger } from "seed-design/ui/help-bubble";

export function DescriptionButton({ description }: { description: string }) {
  return (
    <HelpBubbleTrigger title={description} placement="top">
      <ActionButton
        size="xsmall"
        variant="ghost"
        layout="iconOnly"
        aria-label="설명 보기"
        bleedX="asPadding"
        bleedY="asPadding"
        onClick={(e) => e.stopPropagation()}
      >
        <Icon svg={<IconILowercaseSerifCircleLine />} />
      </ActionButton>
    </HelpBubbleTrigger>
  );
}
