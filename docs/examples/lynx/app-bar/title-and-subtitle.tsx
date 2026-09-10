import "./styles";

import { root } from "@lynx-js/react";
import { AppBar, useSeedClassName } from "@seed-design/lynx-react";

function Root() {
  const seedClassName = useSeedClassName({ colorMode: "system" });

  return (
    <page className={seedClassName}>
      <view className="app-bar-preview">
        <AppBar.Root theme="cupertino">
          <AppBar.Main layout="withSubtitle">
            <AppBar.Title>관심 목록</AppBar.Title>
            <AppBar.Subtitle>3개의 새 소식</AppBar.Subtitle>
          </AppBar.Main>
        </AppBar.Root>
        <view className="app-bar-preview__content">
          <text className="app-bar-preview__status">제목과 부제목을 함께 표시한 AppBar</text>
        </view>
      </view>
    </page>
  );
}

root.render(<Root />);
