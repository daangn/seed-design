import { VStack } from "@seed-design/react";
import { type StaticActivityComponentType, useFlow, useStack } from "@stackflow/react/future";
import { useEffect, useState } from "react";
import { ActionButton } from "seed-design/ui/action-button";
import { AppBar, AppBarBackButton, AppBarLeft, AppBarMain } from "seed-design/ui/app-bar";
import { AppScreen, AppScreenContent } from "seed-design/ui/app-screen";

declare module "@stackflow/config" {
  interface Register {
    ActivityLateMountTest: { delay: string };
  }
}

/**
 * 게이트(권한 확인, 데이터 로딩) 뒤에서 AppScreen 이 뒤늦게 렌더링될 때 push 트랜지션이
 * 어떻게 되는지 눈으로 검증하는 테스트 액티비티.
 *
 * SEED 1.1 은 CSS 셀렉터로 트랜지션을 걸었기 때문에, layer 가 언제 나타나든
 * `[data-global-transition-state=enter-active]` 에 매치되는 순간 애니메이션이 시작됐다.
 * 1.2 부터는 `element.animate()` 로 직접 거는데, 초기 구현은 enter-active 진입 후 한
 * 프레임만 대상을 찾고 없으면 조용히 포기했다 — 그래서 게이트 뒤의 AppScreen 은
 * 트랜지션이 아예 사라졌다.
 *
 * 지금은 enter-active 가 유지되는 동안 매 프레임 다시 찾는다. 판정 기준:
 *
 * - **0ms**: 정상 슬라이드 인.
 * - **150ms** (< 트랜지션 350ms): 게이트가 열린 시점부터 슬라이드 인. WAAPI 는 stackflow 의
 *   전환 상태와 무관하게 재생되므로, 잘리지 않고 350ms 를 온전히 재생한다.
 * - **500ms** (> 350ms): 트랜지션 없이 툭 나타나고, 개발 콘솔에 seed-design 경고가 찍힌다.
 *   여기까지 보장하지 않는 건 의도된 경계다 — 1.1 도 동일했고, 이미 빈 화면으로 트랜지션
 *   시간을 다 기다린 뒤의 슬라이드 인은 오히려 어색하다.
 *
 * 게이트를 AppScreen **안쪽**(AppScreenContent)에 두면 셋 다 정상 슬라이드 인이 된다.
 * 그게 권장 구조다.
 */

const TRANSITION_DURATION = 350;

const DELAYS = ["0", "150", "500"] as const;

/** 권한 확인이나 데이터 로딩 같은 게이트를 흉내낸다. */
function useGate(delay: number) {
  const [ready, setReady] = useState(delay === 0);

  useEffect(() => {
    if (delay === 0) return;
    const timer = setTimeout(() => setReady(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return ready;
}

const ActivityLateMountTest: StaticActivityComponentType<"ActivityLateMountTest"> = ({
  params,
}) => {
  const { push } = useFlow();
  const stack = useStack();
  const delay = Number(params.delay ?? 0);
  const ready = useGate(delay);

  // 배경 액티비티는 stack 변경 시 다시 렌더링되지 않아 라이브 값이 stale 해진다.
  const [depth] = useState(
    () =>
      stack?.activities.filter((activity) => !activity.transitionState.startsWith("exit")).length ??
      0,
  );

  // 게이트가 AppScreen 자체를 막는 구조. 권장하지는 않지만 실제 앱에서 흔한 형태이고,
  // 이 액티비티가 재현하려는 대상이 바로 이것이다.
  if (!ready) return null;

  const isWithinTransition = delay < TRANSITION_DURATION;

  return (
    // 이 트랜지션은 iOS slide 기준이다. 예제 앱의 theme 은 UA 기반이라 데스크톱
    // 브라우저에선 android 로 잡히므로, 어디서 열어도 재현되도록 고정한다.
    <AppScreen transitionStyle="slideFromRightIOS">
      <AppBar>
        <AppBarLeft>
          <AppBarBackButton />
        </AppBarLeft>
        <AppBarMain>Late Mount Test</AppBarMain>
      </AppBar>
      <AppScreenContent>
        {/* 화면 폭을 꽉 채우는 띠. 슬라이드 인이 진행되는 동안 오른쪽에서 밀려 들어온다. */}
        <div
          style={{
            height: 8,
            background: "repeating-linear-gradient(90deg, #ff6f0f 0 24px, #ffd8b8 24px 48px)",
          }}
        />
        <VStack gap="x6" p="x5">
          <VStack gap="x1">
            <div style={{ fontSize: 56, fontWeight: 700, lineHeight: 1 }}>깊이 {depth}</div>
            <div style={{ fontSize: 15, color: "#868b94" }}>
              {delay === 0
                ? "게이트 없이 바로 렌더링된 화면입니다."
                : `게이트가 ${delay}ms 뒤에 열린 화면입니다.`}
            </div>
          </VStack>

          {delay > 0 && (
            <VStack gap="x2" style={{ background: "#f7f8f9", borderRadius: 12, padding: 16 }}>
              <div style={{ fontSize: 13, fontWeight: 700 }}>
                {isWithinTransition ? "트랜지션 시간 안에 열림" : "트랜지션 시간을 넘겨서 열림"}
              </div>
              <div style={{ fontSize: 13, color: "#868b94", lineHeight: 1.6 }}>
                {isWithinTransition ? (
                  <>
                    게이트가 열린 {delay}ms 시점부터 슬라이드 인이 재생돼야 정상입니다. WAAPI
                    트랜지션은 stackflow 의 전환 상태와 무관하게 재생되므로 잘리지 않고{" "}
                    {TRANSITION_DURATION}ms 를 온전히 씁니다.
                  </>
                ) : (
                  <>
                    트랜지션이 이미 끝난 뒤라 슬라이드 인 없이 나타납니다. 개발 콘솔에 seed-design
                    경고가 찍혀 있어야 정상입니다. 의도된 경계예요.
                  </>
                )}
              </div>
            </VStack>
          )}

          <VStack gap="x3">
            <div style={{ fontSize: 15, fontWeight: 700 }}>게이트 지연을 골라 push</div>
            <div style={{ fontSize: 13, color: "#868b94", lineHeight: 1.6 }}>
              push 되는 화면이 AppScreen 을 게이트로 감싸고 있습니다. 트랜지션 시간은{" "}
              {TRANSITION_DURATION}ms 입니다.
            </div>
            {DELAYS.map((value) => (
              <ActionButton
                key={value}
                size="large"
                variant={value === "0" ? "brandSolid" : "neutralSolid"}
                onClick={() => push("ActivityLateMountTest", { delay: value })}
              >
                push (게이트 {value}ms)
              </ActionButton>
            ))}
          </VStack>
        </VStack>
      </AppScreenContent>
    </AppScreen>
  );
};

export default ActivityLateMountTest;
