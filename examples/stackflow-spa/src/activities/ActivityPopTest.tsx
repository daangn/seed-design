import { VStack } from "@seed-design/react";
import { useFlow, useStack, type StaticActivityComponentType } from "@stackflow/react/future";
import { useState } from "react";
import {
  AppBar,
  AppBarBackButton,
  AppBarIconButton,
  AppBarLeft,
  AppBarMain,
  AppBarRight,
} from "seed-design/ui/app-bar";
import { AppScreen, AppScreenContent } from "seed-design/ui/app-screen";
import { ActionButton } from "seed-design/ui/action-button";
import { IconHouseLine } from "@karrotmarket/react-monochrome-icon";

declare module "@stackflow/config" {
  interface Register {
    ActivityPopTest: Record<string, never>;
  }
}

/**
 * 전환 중 중복 pop 가드를 눈으로 검증하기 위한 테스트 액티비티.
 *
 * - "화면 더 쌓기"로 스택을 원하는 만큼 쌓는다.
 * - `pop(2)` : 의도적으로 2개를 닫는다 → 깊이가 2 줄어야 정상.
 * - `pop(); pop();` : 한 핸들러에서 pop을 2번 호출한다. seedPlugin 가드가 적용되면
 *   두 번째 호출은 첫 번째 exit 전환 중에 들어와 "즉시 제거"로 강등되므로, 애니메이션은
 *   한 번만 재생되고 2개가 닫힌다 (= `pop(2)` 와 동일).
 *
 * 깊이 표시 주의: stackflow는 배경 액티비티를 stack 변경 시 다시 렌더링하지 않으므로,
 * 라이브 `useStack().activities.length` 는 pop 후 착지한 화면에서 stale 해진다(갱신 안 됨).
 * 그래서 mount 시점의 깊이를 고정해 표시한다 — 이 화면이 top일 때 이 값은 항상 현재 깊이와 같다.
 */
const ActivityPopTest: StaticActivityComponentType<"ActivityPopTest"> = () => {
  const { push, pop } = useFlow();
  const stack = useStack();

  // mount 시점에 "exit 전환 중이 아닌" 액티비티 수 = 이 화면이 놓인 스택 깊이.
  const [depth] = useState(
    () =>
      stack?.activities.filter((activity) => !activity.transitionState.startsWith("exit")).length ??
      0,
  );

  return (
    <AppScreen>
      <AppBar>
        <AppBarLeft>
          <AppBarBackButton />
        </AppBarLeft>
        <AppBarMain>Pop Test</AppBarMain>
        <AppBarRight>
          <AppBarIconButton aria-label="Home" onClick={() => push("ActivityHome", {})}>
            <IconHouseLine />
          </AppBarIconButton>
        </AppBarRight>
      </AppBar>
      <AppScreenContent>
        <VStack gap="x6" p="x5">
          <VStack gap="x1">
            <div style={{ fontSize: 56, fontWeight: 700, lineHeight: 1 }}>깊이 {depth}</div>
            <div style={{ fontSize: 15, color: "#868b94" }}>
              현재 스택 깊이 (이 화면은 스택의 {depth}번째)
            </div>
          </VStack>

          <VStack gap="x3">
            <ActionButton size="large" onClick={() => push("ActivityPopTest", {})}>
              화면 더 쌓기 (push) → 깊이 +1
            </ActionButton>

            <ActionButton size="large" variant="neutralSolid" onClick={() => pop()}>
              pop() — 한 번 → 깊이 -1
            </ActionButton>

            <ActionButton size="large" variant="neutralSolid" onClick={() => pop(2)}>
              pop(2) — 한 번에 2개 → 깊이 -2
            </ActionButton>

            <ActionButton
              size="large"
              variant="neutralSolid"
              onClick={() => {
                pop();
                pop();
              }}
            >
              pop(); pop(); — 두 번 호출 → 깊이 -2 (= pop(2))
            </ActionButton>
          </VStack>

          <div style={{ fontSize: 13, color: "#868b94", lineHeight: 1.6 }}>
            "화면 더 쌓기"로 4개 이상 쌓은 뒤 각 버튼을 눌러보세요. pop 후 착지한 화면의 "깊이"로 몇
            개가 닫혔는지 알 수 있습니다. pop(2)와 pop(); pop();는 둘 다 2개 닫힙니다(동일). 동시
            pop은 하나만 슬라이드되고 나머지는 즉시 제거됩니다. 백버튼 연타도 동일합니다.
          </div>
        </VStack>
      </AppScreenContent>
    </AppScreen>
  );
};

export default ActivityPopTest;
