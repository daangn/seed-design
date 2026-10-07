import IconChevronRightFill from "@karrotmarket/lynx-monochrome-icon/IconChevronRightFill";

import { ActionButton, SuffixIcon } from "@seed-design/lynx-react";

export default function Example() {
  return (
    <ActionButton>
      라벨
      <SuffixIcon icon={<IconChevronRightFill />} />
    </ActionButton>
  );
}
