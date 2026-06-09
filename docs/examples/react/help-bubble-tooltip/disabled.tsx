import { IconPencilFill } from "@karrotmarket/react-monochrome-icon";
import { HStack, PrefixIcon, Text, VStack } from "@seed-design/react";
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
              disabled={disabled}
            >
              <PrefixIcon svg={<IconPencilFill />} />
              글쓰기
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
                disabled={disabled}
              >
                <PrefixIcon svg={<IconPencilFill />} />
                글쓰기
              </ActionButton>
            </span>
          </HelpBubbleTooltipTrigger>
          <Text textStyle="t3Regular" color="fg.neutralMuted">
            span으로 감쌈 (권장)
          </Text>
        </VStack>
      </HStack>
      <Text textStyle="t4Regular" color="fg.neutralMuted">
        Tab 키로도 포커스해 보세요. span으로 감싼 쪽만 키보드로 열립니다.
      </Text>
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
