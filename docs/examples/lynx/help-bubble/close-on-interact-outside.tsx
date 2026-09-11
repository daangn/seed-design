import "./styles";

import { ActionButton, VStack, useSeedClassName } from "@seed-design/lynx-react";
import { HelpBubbleTrigger } from "@/components/ui/help-bubble";

export default function Example() {
  const seedClassName = useSeedClassName({ colorMode: "system" });

  return (
    <view className={`${seedClassName} docs-lynx-help-bubble-root`}>
      <VStack width="full" height="320px" gap="x16" align="center" justify="center">
        <HelpBubbleTrigger
          defaultOpen
          title="This closes on interactions outside"
          placement="right"
          closeOnInteractOutside
        >
          <ActionButton variant="neutralSolid">토글</ActionButton>
        </HelpBubbleTrigger>
        <HelpBubbleTrigger
          defaultOpen
          title="This does not close on interactions outside"
          placement="right"
          closeOnInteractOutside={false}
        >
          <ActionButton variant="neutralSolid">토글</ActionButton>
        </HelpBubbleTrigger>
      </VStack>
    </view>
  );
}
