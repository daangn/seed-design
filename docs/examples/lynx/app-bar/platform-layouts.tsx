import "./styles";

import IconChevronLeftLine from "@karrotmarket/lynx-monochrome-icon/IconChevronLeftLine";
import IconXmarkLine from "@karrotmarket/lynx-monochrome-icon/IconXmarkLine";
import { root } from "@lynx-js/react";
import { AppBar, useSeedClassName } from "@seed-design/lynx-react";

function Root() {
  const seedClassName = useSeedClassName({ colorMode: "system" });

  return (
    <page className={seedClassName}>
      <view className="app-bar-preview__platforms">
        <view className="app-bar-preview__platform">
          <text className="app-bar-preview__label">Cupertino</text>
          <view className="app-bar-preview app-bar-preview--platform">
            <AppBar.Root theme="cupertino">
              <AppBar.Left>
                <AppBar.IconButton accessibility-label="뒤로" icon={<IconChevronLeftLine />} />
              </AppBar.Left>
              <AppBar.Main layout="withSubtitle">
                <AppBar.Title>화면 제목</AppBar.Title>
                <AppBar.Subtitle>보조 제목</AppBar.Subtitle>
              </AppBar.Main>
              <AppBar.Right>
                <AppBar.IconButton accessibility-label="닫기" icon={<IconXmarkLine />} />
              </AppBar.Right>
            </AppBar.Root>
          </view>
        </view>

        <view className="app-bar-preview__platform">
          <text className="app-bar-preview__label">Android</text>
          <view className="app-bar-preview app-bar-preview--platform">
            <AppBar.Root theme="android">
              <AppBar.Left>
                <AppBar.IconButton accessibility-label="뒤로" icon={<IconChevronLeftLine />} />
              </AppBar.Left>
              <AppBar.Main layout="withSubtitle">
                <AppBar.Title>화면 제목</AppBar.Title>
                <AppBar.Subtitle>보조 제목</AppBar.Subtitle>
              </AppBar.Main>
              <AppBar.Right>
                <AppBar.IconButton accessibility-label="닫기" icon={<IconXmarkLine />} />
              </AppBar.Right>
            </AppBar.Root>
          </view>
        </view>
      </view>
    </page>
  );
}

root.render(<Root />);
