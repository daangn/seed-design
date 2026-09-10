import "./styles";

import IconBellLine from "@karrotmarket/lynx-monochrome-icon/IconBellLine";
import IconChevronLeftLine from "@karrotmarket/lynx-monochrome-icon/IconChevronLeftLine";
import { root } from "@lynx-js/react";
import { AppBar, useSeedClassName } from "@seed-design/lynx-react";

function Root() {
  const seedClassName = useSeedClassName({ colorMode: "system" });

  return (
    <page className={seedClassName}>
      <view className="app-bar-preview">
        <AppBar.Root theme="cupertino">
          <AppBar.Left>
            <AppBar.IconButton accessibility-label="뒤로" icon={<IconChevronLeftLine />} />
          </AppBar.Left>
          <AppBar.Main>
            <AppBar.Title>동네생활</AppBar.Title>
          </AppBar.Main>
          <AppBar.Right>
            <AppBar.IconButton accessibility-label="알림" icon={<IconBellLine />} />
          </AppBar.Right>
        </AppBar.Root>
        <view className="app-bar-preview__content">
          <text className="app-bar-preview__status">화면 콘텐츠</text>
        </view>
      </view>
    </page>
  );
}

root.render(<Root />);
