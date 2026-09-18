import "./styles";

import { useState } from "@lynx-js/react";
import { useSeedClassName } from "@seed-design/lynx-react";
import {
  AppBar,
  AppBarBackButton,
  AppBarCloseButton,
  AppBarLeft,
  AppBarMain,
  AppBarRight,
} from "@/components/ui/app-bar";

export default function Example() {
  const seedClassName = useSeedClassName({ colorMode: "system" });
  const [lastAction, setLastAction] = useState("배경 위에 겹쳐지는 AppBar");

  function handleBack() {
    "background only";
    setLastAction("뒤로 버튼을 눌렀습니다");
  }

  function handleClose() {
    "background only";
    setLastAction("닫기 버튼을 눌렀습니다");
  }

  return (
    <view className={`${seedClassName} docs-lynx-app-bar-root`}>
      <view className="app-bar-preview app-bar-preview--transparent">
        <AppBar theme="cupertino" tone="transparent">
          <AppBarLeft>
            <AppBarBackButton bindtap={handleBack} />
          </AppBarLeft>
          <AppBarMain title="사진 보기" />
          <AppBarRight>
            <AppBarCloseButton bindtap={handleClose} />
          </AppBarRight>
        </AppBar>
        <view className="app-bar-preview__content">
          <text className="app-bar-preview__overlay-text">{lastAction}</text>
        </view>
      </view>
    </view>
  );
}
