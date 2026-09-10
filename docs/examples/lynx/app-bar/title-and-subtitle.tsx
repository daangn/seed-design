import "./styles";

import { useSeedClassName } from "@seed-design/lynx-react";
import { AppBar, AppBarMain } from "@/components/ui/app-bar";

export default function Example() {
  const seedClassName = useSeedClassName({ colorMode: "system" });

  return (
    <view className={`${seedClassName} docs-lynx-app-bar-root`}>
      <view className="app-bar-preview">
        <AppBar theme="cupertino">
          <AppBarMain title="관심 목록" subtitle="3개의 새 소식" />
        </AppBar>
        <view className="app-bar-preview__content">
          <text className="app-bar-preview__status">제목과 부제목을 함께 표시한 AppBar</text>
        </view>
      </view>
    </view>
  );
}
