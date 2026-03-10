import { HelpBubble } from "@seed-design/react";
import { ActionButton } from "seed-design/ui/action-button";

export default function HelpBubblePortal() {
  return (
    <div style={{ overflow: "hidden", padding: "40px 20px" }}>
      <HelpBubble.Root defaultOpen closeOnInteractOutside={false} placement="top">
        <HelpBubble.Trigger asChild>
          <ActionButton>Portal 사용</ActionButton>
        </HelpBubble.Trigger>
        <HelpBubble.PositionerPortal>
          <HelpBubble.Content>
            <HelpBubble.Arrow>
              <HelpBubble.ArrowTip />
            </HelpBubble.Arrow>
            <HelpBubble.Body>
              <HelpBubble.Title>Portal</HelpBubble.Title>
              <HelpBubble.Description>
                부모 요소의 overflow: hidden 영향을 받지 않습니다.
              </HelpBubble.Description>
            </HelpBubble.Body>
          </HelpBubble.Content>
        </HelpBubble.PositionerPortal>
      </HelpBubble.Root>
    </div>
  );
}
