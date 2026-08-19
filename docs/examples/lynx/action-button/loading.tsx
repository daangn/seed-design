import "./styles";
import { root, useState } from "@lynx-js/react";
import { ActionButton, useSeedClassName } from "@seed-design/lynx-react";

function Root() {
  const seedClassName = useSeedClassName({ colorMode: "system" });
  const [loading, setLoading] = useState(false);

  function handleTap() {
    "background only";
    setLoading(true);
    setTimeout(() => setLoading(false), 2000);
  }

  return (
    <page className={seedClassName}>
      <view className="action-button-preview">
        <ActionButton loading={loading} bindtap={handleTap}>
          시간이 걸리는 액션
        </ActionButton>
      </view>
    </page>
  );
}

root.render(<Root />);
