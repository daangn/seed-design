import { HStack } from "@seed-design/react";
import { HelpBubbleTrigger } from "seed-design/ui/help-bubble";
import { ActionButton } from "seed-design/ui/action-button";

export default function () {
  return (
    <HStack gap="x4">
      <HelpBubbleTrigger title="Focus stays on the trigger" showCloseButton>
        <ActionButton variant="neutralSolid">기본</ActionButton>
      </HelpBubbleTrigger>
      <HelpBubbleTrigger title="Focus moves into the bubble" showCloseButton autoFocus>
        <ActionButton variant="neutralSolid">autoFocus</ActionButton>
      </HelpBubbleTrigger>
    </HStack>
  );
}
