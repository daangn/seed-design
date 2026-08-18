import { VStack } from "@seed-design/react";
import { IconHouseLine } from "@karrotmarket/react-monochrome-icon";
import { useFlow, useStack, type StaticActivityComponentType } from "@stackflow/react/future";
import { useEffect, useState } from "react";
import { ActionButton } from "seed-design/ui/action-button";
import {
  NextAppBar,
  NextAppBarBackButton,
  NextAppBarIconButton,
  NextAppBarLeft,
  NextAppBarMain,
  NextAppBarRight,
} from "seed-design/ui/next-app-bar";
import { NextAppScreen, NextAppScreenContent } from "seed-design/ui/next-app-screen";

declare module "@stackflow/config" {
  interface Register {
    ActivityNextAnimateFalseTest: Record<string, never>;
  }
}

/**
 * `animate: false` 와 애니메이션 전환을 섞어 쓸 때 NextAppScreen 이 어떻게 착지하는지
 * 눈이 아니라 값으로 판정하는 테스트 액티비티. `ActivityAnimateFalseTest` 의 NAS 판이다.
 *
 * **무엇이 달라졌나.** 레거시 AppScreen 은 layer 의 인라인 `transform` 이 곧 진실이었고,
 * 그래서 `animate: false` 가 되돌릴 애니메이션을 없애 버리면 `-30%` 가 영구히 눌러앉는
 * 버그가 성립했다. NAS 는 resting 위치를 recipe CSS 가 `data-screen-state` 별로 선언하고
 * WAAPI 는 `fill: "none"` 으로 이동만 담당한다. 인라인 transform 이 남지 않으므로 그
 * 실패 양상 자체가 성립하지 않는다.
 *
 * **대신 볼 것.** `animate: false` 도 코어의 `transitionState` 를 거치므로, 사라지는 top 이
 * `exit-done` 으로 단 한 커밋이라도 렌더되면 뒤 화면은 `pop-behind` 를 집어 350ms 슬라이드를
 * 시작한다. `useNextScreenTransition` 은 뒤따르는 resting state 에서 이미 돌고 있는
 * 애니메이션을 건드리지 않으므로, 그 슬라이드는 끝까지 재생된다. 즉 실패 양상이 "위치가
 * 잘못 고정된다" 에서 "나오지 않아야 할 애니메이션이 나온다" 로 옮겨간다.
 *
 * 아래 패널은 각 화면의 `data-screen-state`, layer 의 computed transform(px), layer 에서
 * 실제로 돌고 있는 WAAPI 애니메이션 개수를 함께 보여준다. resting state(`idle`,
 * `idle-behind`) 일 때만 위치를 판정하고, 전환 중에는 값만 표시한다.
 */

/** horizontalSlide 의 behind park 위치 (recipe CSS 와 animation.ts 의 `-30%`). */
const BEHIND_RATIO = -0.3;

/** computed transform 은 matrix / matrix3d 어느 쪽으로도 올 수 있어 DOMMatrix 로 읽는다. */
function readTranslateX(el: HTMLElement) {
  const { transform } = getComputedStyle(el);
  if (transform === "none") return 0;

  try {
    return new DOMMatrix(transform).m41;
  } catch {
    return null;
  }
}

function probeScreen(root: HTMLElement | undefined) {
  const layer = root?.querySelector<HTMLElement>('[data-part="screen-layer"]');
  if (!root || !layer) return null;

  return {
    state: root.dataset["screenState"] ?? "(없음)",
    ready: root.dataset["screenReady"] !== undefined,
    translateX: readTranslateX(layer),
    parkX: layer.offsetWidth * BEHIND_RATIO,
    running: layer.getAnimations().filter((animation) => animation.playState === "running").length,
  };
}

type ScreenProbe = NonNullable<ReturnType<typeof probeScreen>>;

/**
 * 마운트된 NAS 화면들을 문서 순서(= 스택 순서)로 훑어 top 과 바로 뒤를 읽는다.
 * NAS anatomy 는 레거시(`activity | layer | ...`)와 의도적으로 분리돼 있어, 아직
 * 마이그레이션되지 않은 AppScreen 화면은 이 목록에 잡히지 않는다.
 */
function useScreenProbes() {
  const [probes, setProbes] = useState<{ top: ScreenProbe | null; behind: ScreenProbe | null }>({
    top: null,
    behind: null,
  });

  useEffect(() => {
    const read = () => {
      const screens = Array.from(document.querySelectorAll<HTMLElement>('[data-part="screen"]'));
      const topIndex = screens.findIndex((el) => el.dataset["screenIsTop"] !== undefined);

      setProbes({
        top: probeScreen(screens[topIndex]),
        behind: topIndex > 0 ? probeScreen(screens[topIndex - 1]) : null,
      });
    };

    read();
    const timer = setInterval(read, 100);
    return () => clearInterval(timer);
  }, []);

  return probes;
}

/** resting state 에서만 판정한다. 전환 중에는 어떤 값이든 정상일 수 있다. */
function judge(probe: ScreenProbe) {
  if (probe.translateX === null) return "unknown";

  if (probe.state === "idle") {
    return Math.abs(probe.translateX) < 1 && probe.running === 0 ? "ok" : "bad";
  }
  if (probe.state === "idle-behind") {
    return Math.abs(probe.translateX - probe.parkX) < 1 && probe.running === 0 ? "ok" : "bad";
  }

  return "unknown";
}

const VERDICT_COLOR = {
  ok: "#0a840a",
  bad: "#e8433f",
  unknown: "#868b94",
} as const satisfies Record<ReturnType<typeof judge>, string>;

function Row({ label, probe }: { label: string; probe: ScreenProbe | null }) {
  if (!probe) {
    return (
      <div style={{ display: "flex", gap: 8, alignItems: "baseline", fontSize: 13 }}>
        <span style={{ color: "#868b94", minWidth: 72 }}>{label}</span>
        <code style={{ fontFamily: "ui-monospace, monospace", color: "#868b94" }}>(없음)</code>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", gap: 8, alignItems: "baseline", fontSize: 13 }}>
      <span style={{ color: "#868b94", minWidth: 72 }}>{label}</span>
      <code
        style={{
          fontFamily: "ui-monospace, monospace",
          color: VERDICT_COLOR[judge(probe)],
          fontWeight: 600,
        }}
      >
        {probe.state}
        {probe.ready ? "" : " (not ready)"} · x=
        {probe.translateX === null ? "?" : `${Math.round(probe.translateX)}px`} · 애니{" "}
        {probe.running}
      </code>
    </div>
  );
}

const ActivityNextAnimateFalseTest: StaticActivityComponentType<
  "ActivityNextAnimateFalseTest"
> = () => {
  const { push, pop } = useFlow();
  const stack = useStack();
  const probes = useScreenProbes();

  // 배경 액티비티는 stack 변경 시 다시 렌더링되지 않아 라이브 값이 stale 해진다.
  // mount 시점의 깊이를 고정해 표시한다 (이 화면이 top일 때 항상 현재 깊이와 같다).
  const [depth] = useState(
    () =>
      stack?.activities.filter((activity) => !activity.transitionState.startsWith("exit")).length ??
      0,
  );

  return (
    // behind park(`-30%`)이 존재하는 스타일은 horizontalSlide 뿐이다. 예제 앱의 theme 은
    // UA 기반이라 데스크톱에선 android(verticalSlide)로 잡히므로 스타일을 고정한다.
    <NextAppScreen transitionStyle="horizontalSlide">
      <NextAppBar>
        <NextAppBarLeft>
          <NextAppBarBackButton />
        </NextAppBarLeft>
        <NextAppBarMain title="animate: false (Next)" />
        <NextAppBarRight>
          <NextAppBarIconButton aria-label="Home" onClick={() => push("ActivityHome", {})}>
            <IconHouseLine />
          </NextAppBarIconButton>
        </NextAppBarRight>
      </NextAppBar>
      <NextAppScreenContent>
        {/* 화면 폭을 꽉 채우는 띠. 레이어가 밀려 있으면 오른쪽에 컨테이너 배경이 드러난다. */}
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
              위 줄무늬 띠가 화면 오른쪽 끝까지 닿아 있으면 정상입니다.
            </div>
          </VStack>

          <VStack
            gap="x2"
            style={{ background: "#f7f8f9", borderRadius: 12, padding: 16 }}
            aria-live="polite"
          >
            <div style={{ fontSize: 13, fontWeight: 700 }}>
              DOM 실시간 (state · layer 위치 · 애니)
            </div>
            <Row label="최상단" probe={probes.top} />
            <Row label="바로 뒤" probe={probes.behind} />
            <div style={{ fontSize: 12, color: "#868b94", lineHeight: 1.5 }}>
              초록은 resting state 가 선언한 위치에 정확히 서 있고 돌아가는 애니메이션도 없다는
              뜻입니다. 빨강은 <code>idle</code> / <code>idle-behind</code> 인데 위치나 애니메이션이
              어긋난 경우, 회색은 전환 중이라 판정하지 않는 구간입니다.
            </div>
          </VStack>

          <VStack gap="x3">
            <div style={{ fontSize: 15, fontWeight: 700 }}>시나리오 A — 애니 push → 무애니 pop</div>
            <div style={{ fontSize: 13, color: "#868b94", lineHeight: 1.6 }}>
              ① 아래 <b>애니메이션 push</b> → ② 다음 화면에서 <b>pop(animate: false)</b>.
              <br />
              돌아온 화면이 곧바로 제자리에 서 있어야 합니다. 왼쪽에서 미끄러져 들어오면 사라진 top
              의 <code>exit-done</code> 커밋이 뒤 화면에 <code>pop-behind</code> 를 물려 슬라이드를
              띄운 것이고, 착지 직후 "최상단"이 빨강이면 그 애니메이션이 아직 돌고 있는 것입니다.
            </div>
            <ActionButton size="large" onClick={() => push("ActivityNextAnimateFalseTest", {})}>
              ① push (애니 O)
            </ActionButton>
            <ActionButton
              size="large"
              variant="neutralSolid"
              onClick={() => pop({ animate: false })}
            >
              ② pop (animate: false)
            </ActionButton>
          </VStack>

          <VStack gap="x3">
            <div style={{ fontSize: 15, fontWeight: 700 }}>시나리오 B — 무애니 push → 애니 pop</div>
            <div style={{ fontSize: 13, color: "#868b94", lineHeight: 1.6 }}>
              ① 아래 <b>push(animate: false)</b>. 이 시점에 "바로 뒤"가 <code>idle-behind</code>{" "}
              이고 위치가 park(<code>{`${BEHIND_RATIO * 100}%`}</code>)에 맞아 초록이면 정상입니다.
              레거시와 달리 상태만 바뀌어도 CSS 가 즉시 park 위치를 잡아 주므로, 여기서 DOM 불일치가
              남지 않아야 합니다.
              <br />② 다음 화면에서 <b>애니메이션 pop</b>. 정상 궤적으로 되돌아오는지 봅니다.
            </div>
            <ActionButton
              size="large"
              onClick={() => push("ActivityNextAnimateFalseTest", {}, { animate: false })}
            >
              ① push (animate: false)
            </ActionButton>
            <ActionButton size="large" variant="neutralSolid" onClick={() => pop()}>
              ② pop (애니 O)
            </ActionButton>
          </VStack>
        </VStack>
      </NextAppScreenContent>
    </NextAppScreen>
  );
};

export default ActivityNextAnimateFalseTest;
