import "./styles";

import { root, useState } from "@lynx-js/react";
import { useSeedClassName } from "@seed-design/lynx-react";
import {
  AppBar,
  AppBarBackButton,
  AppBarCloseButton,
  AppBarLeft,
  AppBarMain,
  AppBarRight,
  AppBarSlot,
} from "@/components/ui/app-bar";

function Root() {
  const seedClassName = useSeedClassName({ colorMode: "system" });
  const [lastAction, setLastAction] = useState("없음");

  function handleBack() {
    "background only";
    setLastAction("뒤로");
  }

  function handleClose() {
    "background only";
    setLastAction("닫기");
  }

  return (
    <page className={seedClassName}>
      <view className="app-bar-preview">
        <AppBar theme="cupertino">
          <AppBarLeft>
            <AppBarBackButton bindtap={handleBack} />
          </AppBarLeft>
          <AppBarMain title="작성하기" />
          <AppBarRight>
            <AppBarSlot>
              <text>완료</text>
            </AppBarSlot>
            <AppBarCloseButton bindtap={handleClose} />
          </AppBarRight>
        </AppBar>
        <view className="app-bar-preview__content">
          <text className="app-bar-preview__status">마지막 액션: {lastAction}</text>
        </view>
      </view>
    </page>
  );
}

root.render(<Root />);
