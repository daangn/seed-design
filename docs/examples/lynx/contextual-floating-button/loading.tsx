import IconPlusLine from "@karrotmarket/lynx-monochrome-icon/IconPlusLine";
import { useState } from "@lynx-js/react";

import { ContextualFloatingButton, PrefixIcon } from "@seed-design/lynx-react";

export default function Example() {
  const [loading, setLoading] = useState(false);

  function handleTap() {
    "background only";
    setLoading(true);
    setTimeout(() => setLoading(false), 2000);
  }

  return (
    <ContextualFloatingButton loading={loading} bindtap={handleTap}>
      <PrefixIcon icon={<IconPlusLine />} />
      시간이 걸리는 액션
    </ContextualFloatingButton>
  );
}
