import { useState } from "@lynx-js/react";
import { ActionButton } from "@seed-design/lynx-react";

export default function Example() {
  const [loading, setLoading] = useState(false);

  function handleTap() {
    "background only";
    setLoading(true);
    setTimeout(() => setLoading(false), 2000);
  }

  return (
    <ActionButton loading={loading} bindtap={handleTap}>
      시간이 걸리는 액션
    </ActionButton>
  );
}
