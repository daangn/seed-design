import { ActionButton } from "seed-design/ui/action-button";
import { HelpBubbleAnchor } from "seed-design/ui/help-bubble";

export default function HelpBubblePreview() {
  return (
    <HelpBubbleAnchor defaultOpen flip={true} title="타이틀" description="설명을 추가할 수 있어요.">
      <ActionButton>열기</ActionButton>
    </HelpBubbleAnchor>
  );
}
