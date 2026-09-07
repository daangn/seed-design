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
import { useState, type ReactNode } from "react";
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
import { useSwipeBackSnackbar } from "../hooks/useSwipeBackSnackbar";

/**
 * 스와이프백과 부딪히는 케이스들을 한 화면에 모은다. 이 케이스들은 임의의
 * `swipeBackArea` / `swipeBackCommitRatio` 조합 아래에서 돌아가야 하므로, 두 값을
 * activity params 로 받는다. 조합을 바꾸는 컨트롤은 `ActivityAppScreen` 에
 * 있으며, 거기서 현재 설정 그대로 이 화면을 push 한다.
 */
declare module "@stackflow/config" {
  interface Register {
    ActivityAppScreenGesture: {
      swipeBackArea?: NonNullable<NextAppScreenProps["swipeBackArea"]>;
      swipeBackCommitRatio?: string;
      "bottom-sheet"?: "open";
    };
  }
}

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

const ActivityAppScreenGesture: StaticActivityComponentType<"ActivityAppScreenGesture"> = ({
  params,
}) => {
  const { push } = useFlow();
  const snackbar = useSnackbarAdapter();
  const swipeBackHandlers = useSwipeBackSnackbar();

  const [sliderValues, setSliderValues] = useState([40]);
  const [time, setTime] = useState<TimePickerValue>({ hour: 13, minute: 10 });

  const stepSheet = useStepOverlay({ key: "bottom-sheet" });
  const stepLayerIndex = useActivityZIndexBase({ activityOffset: 1 });

  // URL 을 거쳐 문자열로 들어오므로, 숫자로 읽히지 않으면 prop 자체를 넘기지 않는다.
  const swipeBackCommitRatio = Number(params.swipeBackCommitRatio);
  const hasCommitRatio = Number.isFinite(swipeBackCommitRatio) && swipeBackCommitRatio > 0;

  return (
    <NextAppScreen
      swipeBackArea={params.swipeBackArea}
      {...(hasCommitRatio && { swipeBackCommitRatio })}
      {...swipeBackHandlers}
    >
      <NextAppBar>
        <NextAppBarLeft>
          <NextAppBarBackButton />
        </NextAppBarLeft>
        <NextAppBarMain title="제스처 충돌" />
      </NextAppBar>
      <NextAppScreenContent>
        <VStack px="spacingX.globalGutter" py="x3" gap="x2">
          <Case label="적용된 스와이프백 설정">
            <Text textStyle="articleBody">
              swipeBackArea: {params.swipeBackArea ?? "미지정 (앱 전역 설정)"}
            </Text>
            <Text textStyle="articleBody">
              swipeBackCommitRatio:{" "}
              {hasCommitRatio ? swipeBackCommitRatio : "미지정 (손을 떼는 시점에 판정)"}
            </Text>
            <Text textStyle="t6Regular" color="fg.neutralMuted">
              두 값은 params 로만 받습니다. 다른 조합으로 확인하려면 NextAppScreen 화면의 스와이프백
              컨트롤을 바꾼 뒤 거기서 다시 여세요.
            </Text>
          </Case>

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
            <TimePicker value={time} minuteStep={10} onValueChange={setTime} aria-label="시간" />
          </Case>

          <Case label="DatePicker (continuous)">
            <Box width="100%" maxWidth="358px">
              <ContinuousDatePicker
                height="320px"
                today={{ year: 2026, month: 8, day: 18 }}
                defaultValue={{ year: 2026, month: 8, day: 18 }}
                // monthRange 를 생략하면 yearRange 기본값인 100년 범위 위에서 windowing 이
                // 돌면서 5개월치를 마운트한다. 이 케이스가 보는 것은 세로 연속 스크롤과
                // 스와이프백이 대각선에서 함께 발동하는지 하나뿐이라, 3개월(912px)로도
                // 320px 뷰포트에 스크롤이 남는다.
                monthRange={{ start: { year: 2026, month: 7 }, end: { year: 2026, month: 9 } }}
              />
            </Box>
          </Case>

          <Case label="Box (overflowX)">
            <Box overflowX="auto" borderRadius="r2" bg="bg.neutral">
              <HStack gap="x2" p="x2" width="900px">
                {SWATCHES.map((n) => (
                  <Box key={n} width="140px" height="72px" borderRadius="r2" bg="bg.brandSolid" />
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
        </VStack>
      </NextAppScreenContent>
    </NextAppScreen>
  );
};

export default ActivityAppScreenGesture;
