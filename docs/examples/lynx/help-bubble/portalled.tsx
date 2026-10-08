import { useState } from "@lynx-js/react";
import { ActionButton, Text, VStack } from "@seed-design/lynx-react";
import { HelpBubbleTrigger } from "@/components/ui/help-bubble";

export default function Example() {
  const [count, setCount] = useState(0);

  function handleUnderlyingTap() {
    "background only";
    setCount((current) => current + 1);
  }

  return (
    <VStack width="full" gap="x16" align="center">
      <HelpBubbleTrigger
        defaultOpen
        container="window"
        overlayLevel={2}
        title="바깥을 탭하면 닫혀요"
        placement="right"
      >
        <ActionButton variant="neutralSolid">window</ActionButton>
      </HelpBubbleTrigger>
      <HelpBubbleTrigger
        defaultOpen
        container="window"
        title="바깥을 탭해도 열려 있어요"
        placement="right"
        closeOnInteractOutside={false}
      >
        <ActionButton variant="neutralSolid">window</ActionButton>
      </HelpBubbleTrigger>
      <ActionButton variant="neutralWeak" bindtap={handleUnderlyingTap}>
        {`아래 버튼 ${count}`}
      </ActionButton>
      <Text textStyle="t3Regular" color="fg.neutralMuted">
        overlay 레이어 밖의 탭은 아래 화면으로 전달됩니다.
      </Text>
    </VStack>
  );
}
