import "./styles";

import IconBellLine from "@karrotmarket/lynx-monochrome-icon/IconBellLine";
import IconMagnifyingglassLine from "@karrotmarket/lynx-monochrome-icon/IconMagnifyingglassLine";
import { useState } from "@lynx-js/react";
import { ActionButton, useSeedClassName } from "@seed-design/lynx-react";
import {
  AppBar,
  AppBarBackButton,
  AppBarCloseButton,
  AppBarIconButton,
  AppBarLeft,
  AppBarMain,
  AppBarRight,
} from "@/components/ui/app-bar";

export default function Example() {
  const seedClassName = useSeedClassName({ colorMode: "system" });
  const [showExtraActions, setShowExtraActions] = useState(true);
  const [lastAction, setLastAction] = useState("없음");

  function toggleExtraActions() {
    "background only";
    setShowExtraActions((value) => !value);
  }

  function recordAction(action: string) {
    "background only";
    setLastAction(action);
  }

  return (
    <view className={`${seedClassName} docs-lynx-app-bar-root`}>
      <view className="app-bar-preview">
        <AppBar theme="cupertino">
          <AppBarLeft>
            <AppBarBackButton bindtap={() => recordAction("뒤로")} />
          </AppBarLeft>
          <AppBarMain title="동네생활" />
          <AppBarRight>
            <AppBarIconButton
              accessibility-label="알림"
              icon={<IconBellLine />}
              bindtap={() => recordAction("알림")}
            />
            {showExtraActions && (
              <>
                <AppBarIconButton
                  accessibility-label="검색"
                  icon={<IconMagnifyingglassLine />}
                  bindtap={() => recordAction("검색")}
                />
                <AppBarCloseButton bindtap={() => recordAction("닫기")} />
              </>
            )}
          </AppBarRight>
        </AppBar>
        <view className="app-bar-preview__content app-bar-preview__controls">
          <ActionButton size="small" variant="neutralWeak" bindtap={toggleExtraActions}>
            {showExtraActions ? "검색·닫기 숨기기" : "검색·닫기 표시"}
          </ActionButton>
          <text className="app-bar-preview__status">마지막 액션: {lastAction}</text>
        </view>
      </view>
    </view>
  );
}
