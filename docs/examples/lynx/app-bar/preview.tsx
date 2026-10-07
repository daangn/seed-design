import "./styles";

import IconBellLine from "@karrotmarket/lynx-monochrome-icon/IconBellLine";

import {
  AppBar,
  AppBarBackButton,
  AppBarIconButton,
  AppBarLeft,
  AppBarMain,
  AppBarRight,
} from "@/components/ui/app-bar";

export default function Example() {
  return (
    <view className="app-bar-preview">
      <AppBar theme="cupertino">
        <AppBarLeft>
          <AppBarBackButton />
        </AppBarLeft>
        <AppBarMain title="동네생활" />
        <AppBarRight>
          <AppBarIconButton accessibility-label="알림" icon={<IconBellLine />} />
        </AppBarRight>
      </AppBar>
      <view className="app-bar-preview__content">
        <text className="app-bar-preview__status">화면 콘텐츠</text>
      </view>
    </view>
  );
}
