import "./styles";

import IconBellFill from "@karrotmarket/lynx-monochrome-icon/IconBellFill";
import { useState } from "@lynx-js/react";
import { PrefixIcon, ReactionButton, useSeedClassName } from "@seed-design/lynx-react";

export default function Example() {
  const seedClassName = useSeedClassName({ colorMode: "system" });
  const [{ pressed, loading }, setState] = useState({
    pressed: false,
    loading: false,
  });

  function handleToggle() {
    "background only";
    setState((previous) => ({ pressed: previous.pressed, loading: true }));
    setTimeout(() => {
      setState((previous) => ({ pressed: !previous.pressed, loading: false }));
    }, 2000);
  }

  return (
    <view className={`${seedClassName} docs-lynx-reaction-button-root`}>
      <view className="reaction-button-preview">
        <ReactionButton loading={loading} pressed={pressed} onPressedChange={handleToggle}>
          <PrefixIcon icon={<IconBellFill />} />
          시간이 걸리는 토글
        </ReactionButton>
      </view>
    </view>
  );
}
