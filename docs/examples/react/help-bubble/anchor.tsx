import { VStack } from "@seed-design/react";
import { useState } from "react";
import { Avatar } from "seed-design/ui/avatar";
import { HelpBubbleAnchor } from "seed-design/ui/help-bubble";
import { Switch } from "seed-design/ui/switch";

export default function () {
  const [isControlledHelpBubbleOpen, setIsControlledHelpBubbleOpen] = useState(true);

  return (
    <VStack gap="x16" align="center">
      <HelpBubbleAnchor
        defaultOpen
        title="Anchor, uncontrolled"
        description="클릭으로 열고 닫는 동작 없이 위치만 지정합니다."
        placement="right"
        showCloseButton
        closeOnInteractOutside={false}
      >
        <Avatar size="64" src="https://avatars.githubusercontent.com/u/54893898?v=4" fallback="L" />
      </HelpBubbleAnchor>
      <VStack gap="spacingY.componentDefault" align="center">
        <HelpBubbleAnchor
          open={isControlledHelpBubbleOpen}
          onOpenChange={setIsControlledHelpBubbleOpen}
          title="Anchor, controlled"
          description="클릭으로 열고 닫는 동작 없이 위치만 지정합니다."
          placement="right"
          showCloseButton
          closeOnInteractOutside={false}
        >
          <Avatar
            size="64"
            src="https://avatars.githubusercontent.com/u/54893898?v=4"
            fallback="L"
          />
        </HelpBubbleAnchor>
        <Switch
          size="24"
          tone="neutral"
          label="열림"
          checked={isControlledHelpBubbleOpen}
          onCheckedChange={setIsControlledHelpBubbleOpen}
        />
      </VStack>
    </VStack>
  );
}
