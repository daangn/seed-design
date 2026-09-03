import { nextAppScreenVariantMap } from "@seed-design/css/recipes/next-app-screen";
import { Box, Text, VStack } from "@seed-design/react";
import { useFlow, type StaticActivityComponentType } from "@stackflow/react/future";
import { useState, type ReactNode } from "react";
import { ActionButton } from "seed-design/ui/action-button";
import {
  NextAppBar,
  NextAppBarBackButton,
  NextAppBarLeft,
  NextAppBarMain,
} from "seed-design/ui/next-app-bar";
import {
  NextAppScreen,
  NextAppScreenContent,
  type NextAppScreenProps,
} from "seed-design/ui/next-app-screen";
import { SegmentedControl, SegmentedControlItem } from "seed-design/ui/segmented-control";
import { useSwipeBackSnackbar } from "../hooks/useSwipeBackSnackbar";

/**
 * 화면 전체의 제스처 조건을 바꾸는 케이스들: `ptr`은 content를 PullToRefresh로
 * 감싸고, `overflowX`는 content 자체를 가로로 넘치게 만든다. 섹션 안에 끼워넣을
 * 수 없어 params로 화면을 다시 push한다. `plain`은 둘 다 걸지 않은 기본 상태다.
 */
const CONTENT_MODES = ["plain", "ptr", "overflowX"] as const;

declare module "@stackflow/config" {
  interface Register {
    ActivityNextAppScreen: {
      transitionStyle?: NonNullable<NextAppScreenProps["transitionStyle"]>;
      contentMode?: (typeof CONTENT_MODES)[number];
    };
  }
}

const SWIPE_BACK_AREAS = ["edge", "full", "none"] as const satisfies ReadonlyArray<
  NonNullable<NextAppScreenProps["swipeBackArea"]>
>;

/** `off` 는 prop 을 넘기지 않는 것 — 손을 떼는 시점에 판정하는 기본 동작이다. */
const COMMIT_RATIOS = ["off", "0.1", "0.2", "0.4"] as const;

function Case({ label, children }: { label: string; children: ReactNode }) {
  return (
    <VStack gap="x3" p="x3" borderRadius="r3" bg="bg.neutralWeak">
      <Text textStyle="t4Bold" color="fg.neutral">
        {label}
      </Text>
      {children}
    </VStack>
  );
}

/**
 * 전환 스타일과 스와이프백 설정만 다루는 화면. 전환 QA 는 화면을 여러 개 쌓아야
 * 하므로, 마운트 비용이 큰 케이스는 `ActivityNextAppScreenGesture` 로 옮겨 두고
 * 여기서는 현재 설정 그대로 그 화면을 여는 진입점만 둔다.
 */
const ActivityNextAppScreen: StaticActivityComponentType<"ActivityNextAppScreen"> = ({
  params,
}) => {
  const { push } = useFlow();
  const swipeBackHandlers = useSwipeBackSnackbar();

  const [swipeBackArea, setSwipeBackArea] = useState<(typeof SWIPE_BACK_AREAS)[number]>("edge");
  const [commitRatio, setCommitRatio] = useState<(typeof COMMIT_RATIOS)[number]>("off");

  return (
    <NextAppScreen
      transitionStyle={params.transitionStyle}
      swipeBackArea={swipeBackArea}
      {...(commitRatio !== "off" && { swipeBackCommitRatio: Number(commitRatio) })}
      {...swipeBackHandlers}
    >
      <NextAppBar>
        <NextAppBarLeft>
          <NextAppBarBackButton />
        </NextAppBarLeft>
        <NextAppBarMain title="NextAppScreen" />
      </NextAppBar>
      <NextAppScreenContent
        ptr={params.contentMode === "ptr"}
        onPtrRefresh={() => new Promise((resolve) => setTimeout(resolve, 1500))}
      >
        <VStack px="spacingX.globalGutter" py="x3" gap="x2">
          <Case label="transitionStyle">
            {params.transitionStyle && (
              <Text textStyle="articleBody">transitionStyle: {params.transitionStyle}</Text>
            )}
            {nextAppScreenVariantMap.transitionStyle.map((style) => (
              <ActionButton
                key={style}
                variant={params.transitionStyle === style ? "neutralWeak" : "neutralSolid"}
                onClick={() => push("ActivityNextAppScreen", { transitionStyle: style })}
              >
                push transitionStyle: {style}
              </ActionButton>
            ))}
            <ActionButton onClick={() => push("ActivityNextAppScreenTransparent", {})}>
              push transparent tone
            </ActionButton>
          </Case>

          <Case label="스와이프백">
            <VStack gap="x2" align="center">
              <Text textStyle="t5Bold" aria-hidden>
                Swipe Back Area
              </Text>
              <SegmentedControl
                value={swipeBackArea}
                onValueChange={(value) => {
                  const next = SWIPE_BACK_AREAS.find((area) => area === value);
                  if (next) setSwipeBackArea(next);
                }}
                aria-label="Swipe Back Area"
              >
                {SWIPE_BACK_AREAS.map((area) => (
                  <SegmentedControlItem key={area} value={area}>
                    {area}
                  </SegmentedControlItem>
                ))}
              </SegmentedControl>
              <Text textStyle="t6Regular" color="fg.neutralMuted">
                {swipeBackArea === "none"
                  ? "이 영역 설정에서는 제스처를 받지 않습니다."
                  : "제스처는 위 transitionStyle 의 exit 를 그대로 되감습니다. 스와이프백 후 Snackbar 로 swiped 와 최대 displacement ratio 를 확인하세요."}
              </Text>
            </VStack>
            <VStack gap="x2" align="center">
              <Text textStyle="t5Bold" aria-hidden>
                Swipe Back Commit Ratio
              </Text>
              <SegmentedControl
                value={commitRatio}
                onValueChange={(value) => {
                  const next = COMMIT_RATIOS.find((ratio) => ratio === value);
                  if (next) setCommitRatio(next);
                }}
                aria-label="Swipe Back Commit Ratio"
              >
                {COMMIT_RATIOS.map((ratio) => (
                  <SegmentedControlItem key={ratio} value={ratio}>
                    {ratio}
                  </SegmentedControlItem>
                ))}
              </SegmentedControl>
              <Text textStyle="t6Regular" color="fg.neutralMuted">
                {commitRatio === "off"
                  ? "손을 떼는 시점에 판정합니다. 임계를 넘겨 끌었어도 되돌려 놓으면 취소됩니다."
                  : `ratio 가 ${commitRatio} 보다 커지는 순간, 손을 떼지 않아도 확정됩니다. 그 뒤로는 되돌릴 수 없고 Snackbar 도 그 시점에 뜹니다.`}
              </Text>
            </VStack>
            <ActionButton
              variant="neutralSolid"
              onClick={() =>
                push("ActivityNextAppScreenGesture", {
                  swipeBackArea,
                  ...(commitRatio !== "off" && { swipeBackCommitRatio: commitRatio }),
                })
              }
            >
              이 설정으로 제스처 충돌 화면 열기
            </ActionButton>
          </Case>

          <Case label="contentMode">
            {params.contentMode && (
              <Text textStyle="articleBody">contentMode: {params.contentMode}</Text>
            )}
            {CONTENT_MODES.map((mode) => (
              <ActionButton
                key={mode}
                variant={params.contentMode === mode ? "neutralWeak" : "neutralSolid"}
                onClick={() => push("ActivityNextAppScreen", { contentMode: mode })}
              >
                push contentMode: {mode}
              </ActionButton>
            ))}
          </Case>

          {params.contentMode === "overflowX" && <Box width="200%" height="1px" />}
        </VStack>
      </NextAppScreenContent>
    </NextAppScreen>
  );
};

export default ActivityNextAppScreen;
