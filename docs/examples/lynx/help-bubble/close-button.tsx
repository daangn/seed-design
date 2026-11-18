import { ActionButton } from "@seed-design/lynx-react";
import { HelpBubbleTrigger } from "@/components/ui/help-bubble";

export default function Example() {
  return (
    <HelpBubbleTrigger
      defaultOpen
      showCloseButton
      title="Close Button"
      description="showCloseButton으로 닫기 버튼을 추가할 수 있어요."
    >
      <ActionButton variant="neutralSolid">토글</ActionButton>
    </HelpBubbleTrigger>
  );
}
