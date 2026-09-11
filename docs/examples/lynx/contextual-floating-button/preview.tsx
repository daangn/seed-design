import IconBellFill from "@karrotmarket/lynx-monochrome-icon/IconBellFill";

import { ContextualFloatingButton, PrefixIcon } from "@seed-design/lynx-react";

export default function Example() {
  return (
    <ContextualFloatingButton>
      <PrefixIcon icon={<IconBellFill />} />
      알림 설정
    </ContextualFloatingButton>
  );
}
