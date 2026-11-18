import IconPlusFill from "@karrotmarket/lynx-monochrome-icon/IconPlusFill";

import { ActionButton, Icon } from "@seed-design/lynx-react";

export default function Example() {
  return (
    <ActionButton layout="iconOnly" accessibility-label="추가">
      <Icon icon={<IconPlusFill />} />
    </ActionButton>
  );
}
