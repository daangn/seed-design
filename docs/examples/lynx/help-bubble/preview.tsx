import IconILowercaseSerifCircleFill from "@karrotmarket/lynx-monochrome-icon/IconILowercaseSerifCircleFill";

import { ActionButton, Icon } from "@seed-design/lynx-react";
import { HelpBubbleTrigger } from "@/components/ui/help-bubble";

export default function Example() {
  return (
    <HelpBubbleTrigger defaultOpen title="아래 버튼이나 바깥 영역을 클릭해서 닫아보세요.">
      <ActionButton variant="ghost" size="small" layout="iconOnly" accessibility-label="도움말">
        <Icon icon={<IconILowercaseSerifCircleFill />} />
      </ActionButton>
    </HelpBubbleTrigger>
  );
}
