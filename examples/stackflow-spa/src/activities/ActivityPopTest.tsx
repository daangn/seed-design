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
 * - `pop(2)` : 의도적으로 2개를 닫는다 → 스택 깊이가 2 줄어야 정상.
 * - `pop(); pop();` : 한 핸들러에서 pop을 2번 호출한다. seedPlugin 가드가 적용되면
 *   두 번째 호출은 첫 번째 exit 전환 중에 들어와 무시되므로 1개만 닫힌다.
 */
const ActivityPopTest: StaticActivityComponentType<"ActivityPopTest"> = () => {
  const { push, pop } = useFlow();
  const stack = useStack();

  const depth = stack?.activities.length ?? 0;
  const transitionState = stack?.globalTransitionState ?? "idle";

  // 화면이 처음 만들어진 시점의 깊이를 고정해, pop 후 어느 화면에 착지했는지 식별한다.
  const [screenNo] = useState(() => depth);

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
            <div style={{ fontSize: 56, fontWeight: 700, lineHeight: 1 }}>#{screenNo}</div>
            <div style={{ fontSize: 15, color: "#868b94" }}>
              이 화면이 만들어졌을 때의 스택 깊이
            </div>
          </VStack>

          <VStack gap="x1">
            <div style={{ fontSize: 22, fontWeight: 600 }}>현재 스택 깊이: {depth}</div>
            <div style={{ fontSize: 14, color: "#868b94" }}>전환 상태: {transitionState}</div>
          </VStack>

          <VStack gap="x3">
            <ActionButton size="large" onClick={() => push("ActivityPopTest", {})}>
              화면 더 쌓기 (push)
            </ActionButton>

            <ActionButton size="large" variant="neutralSolid" onClick={() => pop()}>
              pop() — 한 번
            </ActionButton>

            <ActionButton size="large" variant="neutralSolid" onClick={() => pop(2)}>
              pop(2) — 한 번에 2개 (정상: 깊이 -2)
            </ActionButton>

            <ActionButton
              size="large"
              variant="neutralSolid"
              onClick={() => {
                pop();
                pop();
              }}
            >
              pop(); pop(); — 두 번 호출 (가드 시: 깊이 -1)
            </ActionButton>
          </VStack>

          <div style={{ fontSize: 13, color: "#868b94", lineHeight: 1.6 }}>
            먼저 "화면 더 쌓기"로 3개 이상 쌓은 뒤 각 버튼을 눌러 스택 깊이 변화를 관찰하세요.
            백버튼 연타도 동일하게 가드됩니다.
          </div>
        </VStack>
      </AppScreenContent>
    </AppScreen>
  );
};

export default ActivityPopTest;
