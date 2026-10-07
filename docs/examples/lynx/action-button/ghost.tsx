import IconTagFill from "@karrotmarket/lynx-monochrome-icon/IconTagFill";

import { ActionButton, PrefixIcon } from "@seed-design/lynx-react";

export default function Example() {
  return (
    <ActionButton variant="ghost">
      <PrefixIcon icon={<IconTagFill />} />
      Default (fg.neutral)
    </ActionButton>
  );
}
