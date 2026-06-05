import { IconPencilFill } from "@karrotmarket/react-monochrome-icon";
import { HStack, Icon, Text, VStack } from "@seed-design/react";
import { useState } from "react";
import { HelpBubbleTooltipTrigger } from "seed-design/ui/help-bubble-tooltip";
import { ActionButton } from "seed-design/ui/action-button";
import { Switch } from "seed-design/ui/switch";

export default function HelpBubbleTooltipDisabled() {
  const [disabled, setDisabled] = useState(true);

  return (
    <VStack gap="x10" align="center">
      <HStack gap="x10" align="center">
        <VStack gap="x2" align="center">
          <HelpBubbleTooltipTrigger title="권한이 없어 사용할 수 없어요." placement="bottom">
            <ActionButton
              variant="neutralWeak"
              size="small"
              layout="iconOnly"
              aria-label="글쓰기"
              disabled={disabled}
            >
              <Icon svg={<IconPencilFill />} />
            </ActionButton>
          </HelpBubbleTooltipTrigger>
          <Text textStyle="t3Regular" color="fg.neutralMuted">
            span 없음
          </Text>
        </VStack>
        <VStack gap="x2" align="center">
          <HelpBubbleTooltipTrigger title="권한이 없어 사용할 수 없어요." placement="bottom">
            <span tabIndex={disabled ? 0 : undefined} style={{ display: "inline-flex" }}>
              <ActionButton
                variant="neutralWeak"
                size="small"
                layout="iconOnly"
                aria-label="글쓰기"
                disabled={disabled}
                style={{ pointerEvents: disabled ? "none" : undefined }}
              >
                <Icon svg={<IconPencilFill />} />
              </ActionButton>
            </span>
          </HelpBubbleTooltipTrigger>
          <Text textStyle="t3Regular" color="fg.neutralMuted">
            span으로 감쌈
          </Text>
        </VStack>
      </HStack>
      <Switch
        size="24"
        tone="neutral"
        label="버튼 비활성화"
        checked={disabled}
        onCheckedChange={setDisabled}
      />
    </VStack>
  );
}
