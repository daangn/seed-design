import "./styles";

import { useState } from "@lynx-js/react";

import {
  AppBar,
  AppBarLeft,
  AppBarMain,
  AppBarRight,
  AppBarTextButton,
} from "@/components/ui/app-bar";

export default function Example() {
  const [lastAction, setLastAction] = useState("없음");

  function handleCancel() {
    "background only";
    setLastAction("취소");
  }

  function handleDone() {
    "background only";
    setLastAction("완료");
  }

  return (
    <view className="app-bar-preview">
      <AppBar theme="cupertino">
        <AppBarLeft>
          <AppBarTextButton bindtap={handleCancel}>취소</AppBarTextButton>
        </AppBarLeft>
        <AppBarMain title="작성하기" />
        <AppBarRight>
          <AppBarTextButton bindtap={handleDone}>완료</AppBarTextButton>
        </AppBarRight>
      </AppBar>
      <view className="app-bar-preview__content">
        <text className="app-bar-preview__status">마지막 액션: {lastAction}</text>
      </view>
    </view>
  );
}
