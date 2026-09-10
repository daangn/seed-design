import "./styles";
import { useState } from "@lynx-js/react";
import { ActionButton, useSeedClassName } from "@seed-design/lynx-react";

export default function Example() {
  const seedClassName = useSeedClassName({ colorMode: "system" });
  const [loading, setLoading] = useState(false);

  function handleTap() {
    "background only";
    setLoading(true);
    setTimeout(() => setLoading(false), 2000);
  }

  return (
    <view className={`${seedClassName} docs-lynx-action-button-root`}>
      <view className="action-button-preview">
        <ActionButton loading={loading} bindtap={handleTap}>
          시간이 걸리는 액션
        </ActionButton>
      </view>
    </view>
  );
}
