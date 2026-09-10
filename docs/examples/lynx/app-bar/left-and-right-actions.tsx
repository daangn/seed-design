import "./styles";

import IconChevronLeftLine from "@karrotmarket/lynx-monochrome-icon/IconChevronLeftLine";
import IconXmarkLine from "@karrotmarket/lynx-monochrome-icon/IconXmarkLine";
import { root, useState } from "@lynx-js/react";
import { AppBar, useSeedClassName } from "@seed-design/lynx-react";

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
        <AppBar.Root theme="cupertino">
          <AppBar.Left>
            <AppBar.IconButton
              accessibility-label="뒤로"
              icon={<IconChevronLeftLine />}
              bindtap={handleBack}
            />
          </AppBar.Left>
          <AppBar.Main>
            <AppBar.Title>작성하기</AppBar.Title>
          </AppBar.Main>
          <AppBar.Right>
            <AppBar.Slot>
              <text>완료</text>
            </AppBar.Slot>
            <AppBar.IconButton
              accessibility-label="닫기"
              icon={<IconXmarkLine />}
              bindtap={handleClose}
            />
          </AppBar.Right>
        </AppBar.Root>
        <view className="app-bar-preview__content">
          <text className="app-bar-preview__status">마지막 액션: {lastAction}</text>
        </view>
      </view>
    </page>
  );
}

root.render(<Root />);
