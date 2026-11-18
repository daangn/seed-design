import { ActionButton, VStack } from "@seed-design/lynx-react";
import { HelpBubbleTrigger } from "@/components/ui/help-bubble";

export default function Example() {
  return (
    <VStack width="full" gap="x6" align="center" py="80px">
      <HelpBubbleTrigger
        defaultOpen
        title="This closes on interactions outside"
        placement="top"
        closeOnInteractOutside
      >
        <ActionButton variant="neutralSolid">토글</ActionButton>
      </HelpBubbleTrigger>
      <HelpBubbleTrigger
        defaultOpen
        title="This does not close on interactions outside"
        placement="bottom"
        closeOnInteractOutside={false}
      >
        <ActionButton variant="neutralSolid">토글</ActionButton>
      </HelpBubbleTrigger>
    </VStack>
  );
}
