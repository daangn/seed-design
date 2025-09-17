import { ActionButton } from "seed-design/ui/action-button";
import { HelpBubbleTrigger } from "seed-design/ui/help-bubble";

export default function HelpBubblePreview() {
  return (
    <HelpBubbleTrigger
      defaultOpen
      flip={true}
      title="타이틀"
      description="설명을 추가할 수 있어요."
    >
      <ActionButton>열기</ActionButton>
    </HelpBubbleTrigger>
  );
}
