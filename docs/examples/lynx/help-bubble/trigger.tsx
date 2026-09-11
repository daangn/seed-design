import "./styles";

import { useState } from "@lynx-js/react";
import { ActionButton, VStack, useSeedClassName } from "@seed-design/lynx-react";
import { HelpBubbleTrigger } from "@/components/ui/help-bubble";
import { Switch } from "@/components/ui/switch";

export default function Example() {
  const seedClassName = useSeedClassName({ colorMode: "system" });
  const [isControlledHelpBubbleOpen, setIsControlledHelpBubbleOpen] = useState(true);

  function handleControlledOpenChange(nextOpen: boolean) {
    "background only";
    setIsControlledHelpBubbleOpen(nextOpen);
  }

  return (
    <view className={`${seedClassName} docs-lynx-help-bubble-root`}>
      <VStack width="full" height="320px" gap="x16" align="center" justify="center">
        <HelpBubbleTrigger
          defaultOpen
          title="Trigger, uncontrolled"
          description="클릭으로 열고 닫는 동작이 있는 트리거입니다."
          placement="right"
          showCloseButton
          closeOnInteractOutside={false}
        >
          <ActionButton variant="neutralSolid">토글</ActionButton>
        </HelpBubbleTrigger>
        <VStack gap="spacingY.componentDefault" align="center">
          <HelpBubbleTrigger
            open={isControlledHelpBubbleOpen}
            onOpenChange={handleControlledOpenChange}
            title="Trigger, controlled"
            description="클릭으로 열고 닫는 동작이 있는 트리거입니다."
            placement="right"
            showCloseButton
            closeOnInteractOutside={false}
          >
            <ActionButton variant="neutralSolid">토글</ActionButton>
          </HelpBubbleTrigger>
          <Switch
            size="24"
            tone="neutral"
            label="열림"
            checked={isControlledHelpBubbleOpen}
            onCheckedChange={handleControlledOpenChange}
          />
        </VStack>
      </VStack>
    </view>
  );
}
