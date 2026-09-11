import "./styles";

import { ActionButton, VStack, useSeedClassName } from "@seed-design/lynx-react";
import { HelpBubbleTrigger } from "@/components/ui/help-bubble";

export default function Example() {
  const seedClassName = useSeedClassName({ colorMode: "system" });

  return (
    <view className={`${seedClassName} docs-lynx-help-bubble-root`}>
      <VStack width="full" height="320px" align="center" justify="center">
        <HelpBubbleTrigger
          defaultOpen
          showCloseButton
          title="Close Button"
          description="showCloseButton으로 닫기 버튼을 추가할 수 있어요."
        >
          <ActionButton variant="neutralSolid">토글</ActionButton>
        </HelpBubbleTrigger>
      </VStack>
    </view>
  );
}
