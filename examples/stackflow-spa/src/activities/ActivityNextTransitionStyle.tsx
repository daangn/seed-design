import { IconHouseLine } from "@karrotmarket/react-monochrome-icon";
import { Text, VStack } from "@seed-design/react";
import { nextAppScreenVariantMap } from "@seed-design/css/recipes/next-app-screen";
import { useFlow, type StaticActivityComponentType } from "@stackflow/react/future";
import { useRef, useState } from "react";
import { ActionButton } from "seed-design/ui/action-button";
import {
  NextAppBar,
  NextAppBarBackButton,
  NextAppBarIconButton,
  NextAppBarLeft,
  NextAppBarMain,
  NextAppBarRight,
} from "seed-design/ui/next-app-bar";
import {
  NextAppScreen,
  NextAppScreenContent,
  type NextAppScreenProps,
} from "seed-design/ui/next-app-screen";
import { SegmentedControl, SegmentedControlItem } from "seed-design/ui/segmented-control";
import { Snackbar, useSnackbarAdapter } from "seed-design/ui/snackbar";

declare module "@stackflow/config" {
  interface Register {
    ActivityNextTransitionStyle: {
      transitionStyle?: NonNullable<NextAppScreenProps["transitionStyle"]>;
    };
  }
}

const SWIPE_BACK_AREAS = ["edge", "full", "none"] as const satisfies ReadonlyArray<
  NonNullable<NextAppScreenProps["swipeBackArea"]>
>;

const ActivityNextTransitionStyle: StaticActivityComponentType<"ActivityNextTransitionStyle"> = ({
  params: { transitionStyle },
}) => {
  const { push } = useFlow();
  const { create } = useSnackbarAdapter();

  const [swipeBackArea, setSwipeBackArea] = useState<(typeof SWIPE_BACK_AREAS)[number]>("edge");

  // 제스처 진행 중에는 ref 에만 적어 프레임마다 리렌더가 걸리지 않게 한다.
  const peakRatioRef = useRef(0);

  return (
    <NextAppScreen
      transitionStyle={transitionStyle}
      swipeBackArea={swipeBackArea}
      onSwipeBackStart={() => {
        peakRatioRef.current = 0;
        create({ render: () => <Snackbar message="Started swiping" />, timeout: 500 });
      }}
      onSwipeBackMove={({ displacementRatio }) => {
        peakRatioRef.current = Math.max(peakRatioRef.current, displacementRatio);
      }}
      onSwipeBackEnd={({ swiped }) => {
        const peak = peakRatioRef.current.toFixed(2);
        create({
          render: () => <Snackbar message={`Swiped: ${swiped} (peak ratio ${peak})`} />,
          timeout: 1000,
        });
      }}
    >
      <NextAppBar>
        <NextAppBarLeft>
          <NextAppBarBackButton />
        </NextAppBarLeft>
        {/* can be undefined if search parameter isn't provided */}
        <NextAppBarMain title={transitionStyle ?? "Next Transition Styles"} />
        <NextAppBarRight>
          <NextAppBarIconButton aria-label="Home" onClick={() => push("ActivityHome", {})}>
            <IconHouseLine />
          </NextAppBarIconButton>
        </NextAppBarRight>
      </NextAppBar>
      <NextAppScreenContent>
        <VStack px="spacingX.globalGutter" py="x3" gap="x4">
          <VStack gap="x2">
            {nextAppScreenVariantMap.transitionStyle.map((style) => (
              <ActionButton
                key={style}
                variant={transitionStyle === style ? "neutralWeak" : "neutralSolid"}
                onClick={() => push("ActivityNextTransitionStyle", { transitionStyle: style })}
              >
                {style}
              </ActionButton>
            ))}
          </VStack>
          <VStack gap="x2" align="center">
            <Text textStyle="t3Bold" aria-hidden>
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
        </VStack>
      </NextAppScreenContent>
    </NextAppScreen>
  );
};

export default ActivityNextTransitionStyle;
