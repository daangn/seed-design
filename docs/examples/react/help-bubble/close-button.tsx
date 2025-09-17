import { ActionButton } from "@/registry/ui/action-button";
import { HelpBubbleTrigger } from "@/registry/ui/help-bubble";

export default function HelpBubbleCloseButton() {
  return (
    <HelpBubbleTrigger
      defaultOpen
      showCloseButton
      title="Close Button"
      description="showCloseButton으로 닫기 버튼을 추가할 수 있어요."
    >
      <ActionButton>열기</ActionButton>
    </HelpBubbleTrigger>
  );
}
