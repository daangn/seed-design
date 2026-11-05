import IconPlusLine from "@karrotmarket/lynx-monochrome-icon/IconPlusLine";

import { ContextualFloatingButton, PrefixIcon } from "@seed-design/lynx-react";

export default function Example() {
  return (
    <ContextualFloatingButton variant="solid">
      <PrefixIcon icon={<IconPlusLine />} />
      Solid Variant
    </ContextualFloatingButton>
  );
}
