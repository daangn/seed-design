import "./styles";

import {
  AppBar,
  AppBarBackButton,
  AppBarCloseButton,
  AppBarLeft,
  AppBarMain,
  AppBarRight,
} from "@/components/ui/app-bar";

export default function Example() {
  return (
    <view className="app-bar-preview__platforms">
      <view className="app-bar-preview__platform">
        <text className="app-bar-preview__label">Cupertino</text>
        <view className="app-bar-preview">
          <AppBar theme="cupertino">
            <AppBarLeft>
              <AppBarBackButton />
            </AppBarLeft>
            <AppBarMain title="화면 제목" subtitle="보조 제목" />
            <AppBarRight>
              <AppBarCloseButton />
            </AppBarRight>
          </AppBar>
        </view>
      </view>

      <view className="app-bar-preview__platform">
        <text className="app-bar-preview__label">Android</text>
        <view className="app-bar-preview">
          <AppBar theme="android">
            <AppBarLeft>
              <AppBarBackButton />
            </AppBarLeft>
            <AppBarMain title="화면 제목" subtitle="보조 제목" />
            <AppBarRight>
              <AppBarCloseButton />
            </AppBarRight>
          </AppBar>
        </view>
      </view>
    </view>
  );
}
