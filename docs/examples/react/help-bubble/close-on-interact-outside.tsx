import { VStack } from "@seed-design/react";
import { HelpBubbleTrigger } from "seed-design/ui/help-bubble";
import { ActionButton } from "seed-design/ui/action-button";

export default function () {
  return (
    <VStack gap="x16" align="center">
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
  );
}
