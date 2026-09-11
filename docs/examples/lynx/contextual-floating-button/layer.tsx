import IconPlusLine from "@karrotmarket/lynx-monochrome-icon/IconPlusLine";

import { ContextualFloatingButton, PrefixIcon } from "@seed-design/lynx-react";

export default function Example() {
  return (
    <ContextualFloatingButton variant="layer">
      <PrefixIcon icon={<IconPlusLine />} />
      Layer Variant
    </ContextualFloatingButton>
  );
}
