import { Avatar } from "seed-design/ui/avatar";
import { HelpBubbleAnchor } from "seed-design/ui/help-bubble";

export default function HelpBubbleAnchorExample() {
  return (
    <HelpBubbleAnchor
      open
      title="Anchor"
      description="클릭으로 열고 닫는 동작 없이 위치만 지정합니다."
    >
      <Avatar size="96" src="https://avatars.githubusercontent.com/u/54893898?v=4" fallback="L" />
    </HelpBubbleAnchor>
  );
}
