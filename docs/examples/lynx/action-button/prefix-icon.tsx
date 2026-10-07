import IconPlusFill from "@karrotmarket/lynx-monochrome-icon/IconPlusFill";

import { ActionButton, PrefixIcon } from "@seed-design/lynx-react";

export default function Example() {
  return (
    <ActionButton>
      <PrefixIcon icon={<IconPlusFill />} />
      라벨
    </ActionButton>
  );
}
