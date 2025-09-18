import { ActionButton } from "seed-design/ui/action-button";
import { HelpBubbleTrigger } from "seed-design/ui/help-bubble";

export default function HelpBubbleFlip() {
  return (
    <HelpBubbleTrigger
      open
      flip={false}
      title="Flip"
      description="Flip을 끄면 화면 경계에서 방향이 바뀌지 않아요."
    >
      <ActionButton>열기</ActionButton>
    </HelpBubbleTrigger>
  );
}
