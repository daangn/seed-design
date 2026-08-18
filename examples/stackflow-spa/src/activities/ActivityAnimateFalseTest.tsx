import { VStack } from "@seed-design/react";
import { IconHouseLine } from "@karrotmarket/react-monochrome-icon";
import { useFlow, useStack, type StaticActivityComponentType } from "@stackflow/react/future";
import { useEffect, useState } from "react";
import { ActionButton } from "seed-design/ui/action-button";
import {
  AppBar,
  AppBarBackButton,
  AppBarIconButton,
  AppBarLeft,
  AppBarMain,
  AppBarRight,
} from "seed-design/ui/app-bar";
import { AppScreen, AppScreenContent } from "seed-design/ui/app-screen";

declare module "@stackflow/config" {
  interface Register {
    ActivityAnimateFalseTest: Record<string, never>;
  }
}

/**
 * `animate: false` 와 애니메이션 전환을 섞어 쓸 때의 두 가지 증상을 눈으로 검증하는 테스트 액티비티.
 *
 * - **시나리오 A (수정됨)**: 애니메이션 `push` → `pop({ animate: false })`.
 *   착지 화면이 `-30%` 에 고정되던 버그. 지금은 정상 위치로 돌아와야 한다.
 * - **시나리오 B (수정 대상 아님)**: `push({ animate: false })` → 애니메이션 `pop()`.
 *   뒤 화면이 idle 자세(`-30%`)로 안 들어가지만, pop 애니메이션의 첫 키프레임이 `-30%` 라
 *   즉시 덮어쓴다. 프레임 단위로 재보면 top 이 아직 `x=0`(전체를 가림)인 동안 교정이
 *   끝나고, top 이 실제로 움직이기 시작하는 프레임부터는 정상 케이스와 궤적이 같다.
 *   즉 DOM 상태 불일치일 뿐 화면에는 드러나지 않는다.
 *
 * 두 경우 모두 `animate: false` 가 코어의 enter-active/exit-active 단계를 건너뛰기 때문에
 * 생긴다. 차이는 A 는 되돌릴 애니메이션이 아예 없어 영구히 남고, B 는 다음 애니메이션이
 * 스스로 교정한다는 점이다. 아래 "DOM 실시간" 패널이 실제 인라인 transform 을 그대로
 * 보여주므로, 눈으로 판정하지 않고 값으로 확인할 수 있다.
 */

const BEHIND_OFFSET = "translate3d(-30%, 0, 0)";

/** 현재 최상단/바로 뒤 액티비티 layer 의 인라인 transform 을 폴링해서 읽는다. */
function useLayerTransforms() {
  const [transforms, setTransforms] = useState({ top: "", behind: "" });

  useEffect(() => {
    const read = () => {
      const activities = Array.from(
        document.querySelectorAll<HTMLElement>("[data-part='activity']"),
      );
      const topIndex = activities.findIndex((el) => el.dataset["activityIsTop"] !== undefined);
      const layerOf = (el: HTMLElement | undefined) =>
        el?.querySelector<HTMLElement>("[data-part='layer']")?.style.transform ?? "";

      setTransforms({
        top: layerOf(activities[topIndex]),
        behind: topIndex > 0 ? layerOf(activities[topIndex - 1]) : "",
      });
    };

    read();
    const timer = setInterval(read, 100);
    return () => clearInterval(timer);
  }, []);

  return transforms;
}

function Row({ label, value }: { label: string; value: string }) {
  const isOffset = value === BEHIND_OFFSET;
  return (
    <div style={{ display: "flex", gap: 8, alignItems: "baseline", fontSize: 13 }}>
      <span style={{ color: "#868b94", minWidth: 96 }}>{label}</span>
      <code
        style={{
          fontFamily: "ui-monospace, monospace",
          color: isOffset ? "#e8433f" : "#0a840a",
          fontWeight: 600,
        }}
      >
        {value === "" ? "(없음 — 기본 위치)" : value}
      </code>
    </div>
  );
}

// Legacy AppScreen 회귀 검증 전용. 신규 activity 는 NextAppScreen 만 쓴다.
// NextAppScreen 짝: ActivityNextAnimateFalseTest
const ActivityAnimateFalseTest: StaticActivityComponentType<"ActivityAnimateFalseTest"> = () => {
  const { push, pop } = useFlow();
  const stack = useStack();
  const transforms = useLayerTransforms();

  // 배경 액티비티는 stack 변경 시 다시 렌더링되지 않아 라이브 값이 stale 해진다.
  // mount 시점의 깊이를 고정해 표시한다 (이 화면이 top일 때 항상 현재 깊이와 같다).
  const [depth] = useState(
    () =>
      stack?.activities.filter((activity) => !activity.transitionState.startsWith("exit")).length ??
      0,
  );

  return (
    // 이 버그는 iOS slide 전용이다. 예제 앱의 theme 은 UA 기반이라 데스크톱 브라우저에선
    // android 로 잡히므로, 어디서 열어도 재현되도록 transitionStyle 을 고정한다.
    <AppScreen transitionStyle="slideFromRightIOS">
      <AppBar>
        <AppBarLeft>
          <AppBarBackButton />
        </AppBarLeft>
        <AppBarMain>animate: false Test (Legacy)</AppBarMain>
        <AppBarRight>
          <AppBarIconButton aria-label="Home" onClick={() => push("ActivityHome", {})}>
            <IconHouseLine />
          </AppBarIconButton>
        </AppBarRight>
      </AppBar>
      <AppScreenContent>
        {/* 화면 폭을 꽉 채우는 띠. 레이어가 -30% 밀리면 오른쪽에 컨테이너 배경이 드러난다. */}
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
            <div style={{ fontSize: 13, fontWeight: 700 }}>DOM 실시간 (layer transform)</div>
            <Row label="최상단" value={transforms.top} />
            <Row label="바로 뒤" value={transforms.behind} />
            <div style={{ fontSize: 12, color: "#868b94", lineHeight: 1.5 }}>
              최상단이 <code>{BEHIND_OFFSET}</code> 이면 버그입니다. 바로 뒤가 그 값인 것은 iOS
              패럴랙스의 정상 idle 자세입니다.
            </div>
          </VStack>

          <VStack gap="x3">
            <div style={{ fontSize: 15, fontWeight: 700 }}>시나리오 A — 이번에 고친 버그</div>
            <div style={{ fontSize: 13, color: "#868b94", lineHeight: 1.6 }}>
              ① 아래 <b>애니메이션 push</b> → ② 다음 화면에서 <b>pop(animate: false)</b>.
              <br />
              돌아온 화면이 왼쪽으로 밀려 있지 않고, "최상단"이 <code>(없음)</code> 이면 정상입니다.
            </div>
            <ActionButton size="large" onClick={() => push("ActivityAnimateFalseTest", {})}>
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
            <div style={{ fontSize: 15, fontWeight: 700 }}>
              시나리오 B — DOM 불일치 (화면엔 안 드러남)
            </div>
            <div style={{ fontSize: 13, color: "#868b94", lineHeight: 1.6 }}>
              ① 아래 <b>push(animate: false)</b> → 이 시점에 "바로 뒤"가 <code>(없음)</code> 입니다.{" "}
              <code>{BEHIND_OFFSET}</code> 이어야 정상이에요.
              <br />② 다음 화면에서 <b>애니메이션 pop</b>. <b>화면은 정상으로 보입니다</b> — pop
              애니메이션의 첫 키프레임이 <code>{BEHIND_OFFSET}</code> 라서 잘못된 값을 즉시
              덮어쓰고, 그 교정이 뒤 화면이 아직 top 에 완전히 가려진 동안 끝나거든요.
              <br />A 와 달리 <b>다음 애니메이션이 스스로 교정</b>하므로 수정 대상이 아닙니다.
            </div>
            <ActionButton
              size="large"
              onClick={() => push("ActivityAnimateFalseTest", {}, { animate: false })}
            >
              ① push (animate: false)
            </ActionButton>
            <ActionButton size="large" variant="neutralSolid" onClick={() => pop()}>
              ② pop (애니 O)
            </ActionButton>
          </VStack>
        </VStack>
      </AppScreenContent>
    </AppScreen>
  );
};

export default ActivityAnimateFalseTest;
