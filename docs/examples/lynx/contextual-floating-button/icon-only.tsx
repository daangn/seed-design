import IconPlusFill from "@karrotmarket/lynx-monochrome-icon/IconPlusFill";

import { ContextualFloatingButton, Icon } from "@seed-design/lynx-react";

export default function Example() {
  return (
    <ContextualFloatingButton layout="iconOnly" accessibility-label="추가">
      <Icon icon={<IconPlusFill />} />
    </ContextualFloatingButton>
  );
}
