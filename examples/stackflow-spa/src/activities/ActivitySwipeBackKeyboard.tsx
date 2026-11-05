import { VStack } from "@seed-design/react";
import { useFlow, type StaticActivityComponentType } from "@stackflow/react/future";
import { useState } from "react";
import { ActionButton } from "seed-design/ui/action-button";
import { AppBar, AppBarBackButton, AppBarLeft, AppBarMain } from "seed-design/ui/app-bar";
import { AppScreen, AppScreenContent } from "seed-design/ui/app-screen";

declare module "@stackflow/config" {
  interface Register {
    ActivitySwipeBackKeyboard: {};
  }
}

const ActivitySwipeBackKeyboard: StaticActivityComponentType<"ActivitySwipeBackKeyboard"> = () => {
  const { push } = useFlow();
  const [focused, setFocused] = useState(false);

  return (
    <AppScreen theme="cupertino" transitionStyle="slideFromRightIOS">
      <AppBar>
        <AppBarLeft>
          <AppBarBackButton />
        </AppBarLeft>
        <AppBarMain>스와이프백 키보드</AppBarMain>
      </AppBar>
      <AppScreenContent>
        <VStack gap="x5" p="x5">
          <p>
            입력 화면을 한 장 더 열고 글을 입력한 뒤, 왼쪽 가장자리에서 천천히 오른쪽으로
            밀어보세요.
          </p>
          <ActionButton onClick={() => push("ActivitySwipeBackKeyboard", {})}>
            입력 화면 한 장 더 열기
          </ActionButton>
          <label>
            검색어
            <input
              aria-label="검색어"
              placeholder="여기를 눌러 키보드를 여세요"
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              style={{
                display: "block",
                width: "100%",
                boxSizing: "border-box",
                marginTop: 8,
                padding: 12,
                fontSize: 16,
                border: "1px solid #868b94",
                borderRadius: 8,
              }}
            />
          </label>
          <p role="status">입력 포커스: {focused ? "있음" : "없음"}</p>
          <p>
            정상 동작: 가장자리를 터치하면 입력 포커스가 해제되고 키보드가 내려가기 시작합니다.
            화면을 조금 밀었다가 되돌려 취소해도 키보드는 다시 열리지 않습니다.
          </p>
          <p>
            실제 키보드와 커서 잔상은 iPhone의 Safari 또는 앱 웹뷰에서 확인하세요. 데스크톱에서는
            모바일 터치 에뮬레이션으로 포커스 상태를 확인할 수 있습니다.
          </p>
        </VStack>
      </AppScreenContent>
    </AppScreen>
  );
};

export default ActivitySwipeBackKeyboard;
