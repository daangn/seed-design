import { nextAppScreenVariantMap } from "@seed-design/css/recipes/next-app-screen";
import {
  Box,
  ContinuousDatePicker,
  HStack,
  Portal,
  Text,
  TimePicker,
  VStack,
  type TimePickerValue,
} from "@seed-design/react";
import { useActivityZIndexBase } from "@seed-design/stackflow";
import { useFlow, type StaticActivityComponentType } from "@stackflow/react/future";
import { useRef, useState, type ReactNode } from "react";
import { useStepOverlay } from "seed-design/stackflow/use-step-overlay";
import { ActionButton } from "seed-design/ui/action-button";
import {
  BottomSheetContent,
  BottomSheetFooter,
  BottomSheetRoot,
  BottomSheetTrigger,
} from "seed-design/ui/bottom-sheet";
import {
  ChipTabsCarousel,
  ChipTabsContent,
  ChipTabsList,
  ChipTabsRoot,
  ChipTabsTrigger,
} from "seed-design/ui/chip-tabs";
import { HelpBubbleTrigger } from "seed-design/ui/help-bubble";
import { MenuContent, MenuGroup, MenuItem, MenuRoot, MenuTrigger } from "seed-design/ui/menu";
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
import {
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectRoot,
  SelectTrigger,
} from "seed-design/ui/select";
import { Slider } from "seed-design/ui/slider";
import { Snackbar, useSnackbarAdapter } from "seed-design/ui/snackbar";
import { TabsCarousel, TabsContent, TabsList, TabsRoot, TabsTrigger } from "seed-design/ui/tabs";

/**
 * 화면 전체의 제스처 조건을 바꾸는 케이스들: `ptr`은 content를 PullToRefresh로
 * 감싸고, `overflowX`는 content 자체를 가로로 넘치게 만든다. 섹션 안에 끼워넣을
 * 수 없어 params로 화면을 다시 push한다. `bare`는 반대 방향으로, 케이스를 전부
 * 걷어내 무거운 콘텐츠 없이 전환 자체만 보게 한다.
 */
const CONTENT_MODES = ["bare", "ptr", "overflowX"] as const;

declare module "@stackflow/config" {
  interface Register {
    ActivityNextAppScreen: {
      transitionStyle?: NonNullable<NextAppScreenProps["transitionStyle"]>;
      contentMode?: (typeof CONTENT_MODES)[number];
      "bottom-sheet"?: "open";
    };
  }
}

const SWIPE_BACK_AREAS = ["edge", "full", "none"] as const satisfies ReadonlyArray<
  NonNullable<NextAppScreenProps["swipeBackArea"]>
>;

/** `off` 는 prop 을 넘기지 않는 것 — 손을 떼는 시점에 판정하는 기본 동작이다. */
const COMMIT_RATIOS = ["off", "0.1", "0.2", "0.4"] as const;

const OVERFLOWING_TABS = [
  "전체",
  "중고거래",
  "동네업체",
  "알바",
  "부동산",
  "중고차",
  "동네생활",
  "모임",
  "채팅",
  "내 근처",
];

const SWATCHES = [1, 2, 3, 4, 5, 6];

/** 화면 없이 오버레이만 렌더하는 activity들. */
const OVERLAY_ACTIVITIES = [
  { name: "ActivityBottomSheet", label: "BottomSheet" },
  { name: "ActivitySwipeableMenuSheet", label: "SwipeableMenuSheet" },
  { name: "ActivityAlertDialog", label: "AlertDialog" },
  { name: "ActivitySidePanel", label: "SidePanel" },
] as const;

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

const ActivityNextAppScreen: StaticActivityComponentType<"ActivityNextAppScreen"> = ({
  params,
}) => {
  const { push } = useFlow();
  const snackbar = useSnackbarAdapter();

  const [sliderValues, setSliderValues] = useState([40]);
  const [time, setTime] = useState<TimePickerValue>({ hour: 13, minute: 10 });

  const [swipeBackArea, setSwipeBackArea] = useState<(typeof SWIPE_BACK_AREAS)[number]>("edge");
  const [commitRatio, setCommitRatio] = useState<(typeof COMMIT_RATIOS)[number]>("off");

  // 제스처 진행 중에는 ref 에만 적어 프레임마다 리렌더가 걸리지 않게 한다.
  const peakRatioRef = useRef(0);

  const stepSheet = useStepOverlay({ key: "bottom-sheet" });
  const stepLayerIndex = useActivityZIndexBase({ activityOffset: 1 });

  const showCases = params.contentMode !== "bare";

  return (
    <NextAppScreen
      transitionStyle={params.transitionStyle}
      swipeBackArea={swipeBackArea}
      {...(commitRatio !== "off" && { swipeBackCommitRatio: Number(commitRatio) })}
      onSwipeBackStart={() => {
        peakRatioRef.current = 0;
        snackbar.create({ render: () => <Snackbar message="Started swiping" />, timeout: 500 });
      }}
      onSwipeBackMove={({ displacementRatio }) => {
        peakRatioRef.current = Math.max(peakRatioRef.current, displacementRatio);
      }}
      onSwipeBackEnd={({ swiped }) => {
        const peak = peakRatioRef.current.toFixed(2);
        snackbar.create({
          render: () => <Snackbar message={`Swiped: ${swiped} (peak ratio ${peak})`} />,
          timeout: 1000,
        });
      }}
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
          </Case>

          {showCases && (
            <>
              <Case label="Slider">
                <Slider
                  label="가격"
                  min={0}
                  max={100}
                  values={sliderValues}
                  onValuesChange={setSliderValues}
                />
              </Case>

              <Case label="Tabs">
                <TabsRoot defaultValue={OVERFLOWING_TABS[0]} triggerLayout="hug">
                  <TabsList>
                    {OVERFLOWING_TABS.map((label) => (
                      <TabsTrigger key={label} value={label}>
                        {label}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                  <TabsCarousel swipeable>
                    {OVERFLOWING_TABS.map((label) => (
                      <TabsContent key={label} value={label}>
                        <Box p="x4">{label}</Box>
                      </TabsContent>
                    ))}
                  </TabsCarousel>
                </TabsRoot>
              </Case>

              <Case label="ChipTabs">
                <ChipTabsRoot defaultValue={OVERFLOWING_TABS[0]}>
                  <ChipTabsList>
                    {OVERFLOWING_TABS.map((label) => (
                      <ChipTabsTrigger key={label} value={label}>
                        {label}
                      </ChipTabsTrigger>
                    ))}
                  </ChipTabsList>
                  <ChipTabsCarousel swipeable>
                    {OVERFLOWING_TABS.map((label) => (
                      <ChipTabsContent key={label} value={label}>
                        <Box p="x4">{label}</Box>
                      </ChipTabsContent>
                    ))}
                  </ChipTabsCarousel>
                </ChipTabsRoot>
              </Case>

              <Case label="TimePicker">
                <TimePicker
                  value={time}
                  minuteStep={10}
                  onValueChange={setTime}
                  aria-label="시간"
                />
              </Case>

              <Case label="DatePicker (continuous)">
                <Box width="100%" maxWidth="358px">
                  <ContinuousDatePicker
                    height="320px"
                    today={{ year: 2026, month: 8, day: 18 }}
                    defaultValue={{ year: 2026, month: 8, day: 18 }}
                  />
                </Box>
              </Case>

              <Case label="Box (overflowX)">
                <Box overflowX="auto" borderRadius="r2" bg="bg.neutral">
                  <HStack gap="x2" p="x2" width="900px">
                    {SWATCHES.map((n) => (
                      <Box
                        key={n}
                        width="140px"
                        height="72px"
                        borderRadius="r2"
                        bg="bg.brandSolid"
                      />
                    ))}
                  </HStack>
                </Box>
              </Case>

              <Case label="Portal 팝오버">
                <MenuRoot size="medium">
                  <MenuTrigger asChild>
                    <ActionButton variant="neutralSolid">Menu 열기</ActionButton>
                  </MenuTrigger>
                  <MenuContent>
                    <MenuGroup>
                      <MenuItem label="첫 번째" />
                      <MenuItem label="두 번째" />
                      <MenuItem label="세 번째" />
                    </MenuGroup>
                  </MenuContent>
                </MenuRoot>
                <Box width="200px">
                  <SelectRoot label="과일" defaultValue={["apple"]}>
                    <SelectTrigger placeholder="과일 선택" />
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="apple" label="사과" />
                        <SelectItem value="banana" label="바나나" />
                        <SelectItem value="cherry" label="체리" />
                      </SelectGroup>
                    </SelectContent>
                  </SelectRoot>
                </Box>
                <HelpBubbleTrigger title="HelpBubble" description="HelpBubble" showCloseButton>
                  <ActionButton variant="neutralSolid">HelpBubble 열기</ActionButton>
                </HelpBubbleTrigger>
              </Case>

              <Case label="Snackbar">
                <ActionButton
                  variant="neutralSolid"
                  onClick={() =>
                    snackbar.create({
                      render: () => <Snackbar variant="positive" message="Snackbar" />,
                    })
                  }
                >
                  Snackbar 띄우기
                </ActionButton>
              </Case>

              <Case label="BottomSheet (step)">
                <BottomSheetRoot {...stepSheet.overlayProps}>
                  <BottomSheetTrigger asChild>
                    <ActionButton variant="neutralSolid">BottomSheet 열기</ActionButton>
                  </BottomSheetTrigger>
                  <Portal>
                    <BottomSheetContent showHandle title="BottomSheet" layerIndex={stepLayerIndex}>
                      <BottomSheetFooter>
                        <ActionButton
                          flexGrow
                          variant="neutralSolid"
                          onClick={() => stepSheet.setOpen(false)}
                        >
                          닫기
                        </ActionButton>
                      </BottomSheetFooter>
                    </BottomSheetContent>
                  </Portal>
                </BottomSheetRoot>
              </Case>

              <Case label="오버레이 activity">
                {OVERLAY_ACTIVITIES.map(({ name, label }) => (
                  <ActionButton key={name} variant="neutralSolid" onClick={() => push(name, {})}>
                    push {label}
                  </ActionButton>
                ))}
              </Case>
            </>
          )}

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
