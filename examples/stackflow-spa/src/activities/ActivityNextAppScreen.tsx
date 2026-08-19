import { nextAppScreenVariantMap } from "@seed-design/css/recipes/next-app-screen";
import {
  Box,
  DatePicker,
  HStack,
  ScrollFog,
  Text,
  TimePicker,
  VStack,
  type TimePickerValue,
} from "@seed-design/react";
import { useFlow, type StaticActivityComponentType } from "@stackflow/react/future";
import { useState, type ReactNode } from "react";
import { ActionButton } from "seed-design/ui/action-button";
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

/**
 * 화면 전체의 제스처 조건을 바꾸는 케이스들: `ptr`은 content를 PullToRefresh로
 * 감싸고, `overflowX`는 content 자체를 가로로 넘치게 만든다. 섹션 안에 끼워넣을
 * 수 없어 params로 화면을 다시 push한다.
 */
const CONTENT_MODES = ["ptr", "overflowX"] as const;

declare module "@stackflow/config" {
  interface Register {
    ActivityNextAppScreen: {
      transitionStyle?: NonNullable<NextAppScreenProps["transitionStyle"]>;
      swipeBackArea?: NonNullable<NextAppScreenProps["swipeBackArea"]>;
      contentMode?: (typeof CONTENT_MODES)[number];
    };
  }
}

const SWIPE_BACK_AREAS = ["edge", "full", "none"] as const satisfies ReadonlyArray<
  NonNullable<NextAppScreenProps["swipeBackArea"]>
>;

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

/**
 * 화면을 덮는 오버레이들. 넷 다 화면 없이 오버레이만 렌더하는 activity라,
 * push하면 이 화면이 top 자리를 내주고 스와이프백 게이트가 닫힌다.
 */
const OVERLAY_ACTIVITIES = [
  { name: "ActivityBottomSheet", label: "BottomSheet" },
  { name: "ActivitySwipeableMenuSheet", label: "SwipeableMenuSheet" },
  { name: "ActivityAlertDialog", label: "AlertDialog" },
  { name: "ActivitySidePanel", label: "SidePanel" },
] as const;

function Section({ title, note, children }: { title: string; note: string; children: ReactNode }) {
  return (
    <VStack gap="x3" py="x4">
      <VStack gap="x1">
        <Text textStyle="t5Bold" color="fg.neutral">
          {title}
        </Text>
        <Text textStyle="t3Regular" color="fg.neutralMuted">
          {note}
        </Text>
      </VStack>
      {children}
    </VStack>
  );
}

function Case({ label, note, children }: { label: string; note: string; children: ReactNode }) {
  return (
    <VStack gap="x3" p="x3" borderRadius="r3" bg="bg.neutralWeak">
      <VStack gap="x1">
        <Text textStyle="t4Bold" color="fg.neutral">
          {label}
        </Text>
        <Text textStyle="t3Regular" color="fg.neutralMuted">
          {note}
        </Text>
      </VStack>
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

  return (
    <NextAppScreen transitionStyle={params.transitionStyle} swipeBackArea={params.swipeBackArea}>
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
          <Section
            title="설정"
            note="swipeBackArea를 지정하지 않으면 seedPlugin 기본값을 따릅니다. 이 예제 앱은 iOS에서만 full입니다."
          >
            {params.transitionStyle && (
              <Text textStyle="articleBody">transitionStyle: {params.transitionStyle}</Text>
            )}
            {params.swipeBackArea && (
              <Text textStyle="articleBody">swipeBackArea: {params.swipeBackArea}</Text>
            )}
            {params.contentMode && (
              <Text textStyle="articleBody">contentMode: {params.contentMode}</Text>
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
            {SWIPE_BACK_AREAS.map((area) => (
              <ActionButton
                key={area}
                variant={params.swipeBackArea === area ? "neutralWeak" : "neutralSolid"}
                onClick={() => push("ActivityNextAppScreen", { swipeBackArea: area })}
              >
                push swipeBackArea: {area}
              </ActionButton>
            ))}
            <ActionButton onClick={() => push("ActivityNextAppScreenTransparent", {})}>
              push transparent tone
            </ActionButton>
          </Section>

          <Section
            title="A. 가로 제스처 — 정면 충돌"
            note="full 모드는 touch 이벤트만 듣고 defaultPrevented도 보지 않습니다. pointer 기반 제스처나 embla는 자동으로 걸러지지 않아, 오른쪽으로 끄는 한 번의 동작이 두 제스처를 동시에 굴립니다."
          >
            <Case
              label="Slider"
              note="pointer 드래그 + setPointerCapture + touch-action: none. 셋 다 touch 리스너를 막지 못합니다. 썸을 오른쪽으로 끌어보세요."
            >
              <Slider
                label="가격"
                min={0}
                max={100}
                values={sliderValues}
                onValuesChange={setSliderValues}
              />
            </Case>

            <Case
              label="Tabs (carousel)"
              note="embla가 첫 touchmove에서 가로로 판정하면 이후 move를 preventDefault 하지만, swipe-back은 그 플래그를 읽지 않습니다. 본문을 오른쪽으로 쓸면(= 이전 탭) 겹칩니다. 트리거는 셋뿐이라 탭바 자체는 넘치지 않습니다 — 넘칠 때의 충돌은 D에 있습니다."
            >
              <TabsRoot defaultValue="a">
                <TabsList>
                  <TabsTrigger value="a">탭 A</TabsTrigger>
                  <TabsTrigger value="b">탭 B</TabsTrigger>
                  <TabsTrigger value="c">탭 C</TabsTrigger>
                </TabsList>
                <TabsCarousel swipeable>
                  <TabsContent value="a">
                    <Box p="x4">탭 A 본문</Box>
                  </TabsContent>
                  <TabsContent value="b">
                    <Box p="x4">탭 B 본문</Box>
                  </TabsContent>
                  <TabsContent value="c">
                    <Box p="x4">탭 C 본문</Box>
                  </TabsContent>
                </TabsCarousel>
              </TabsRoot>
            </Case>

            <Case
              label="ChipTabs (carousel)"
              note="Tabs와 같은 embla 경로입니다. carousel 슬롯이 overflow: hidden이라 findBlockingAncestor의 양보 대상도 아닙니다."
            >
              <ChipTabsRoot defaultValue="a">
                <ChipTabsList>
                  <ChipTabsTrigger value="a">칩 A</ChipTabsTrigger>
                  <ChipTabsTrigger value="b">칩 B</ChipTabsTrigger>
                  <ChipTabsTrigger value="c">칩 C</ChipTabsTrigger>
                </ChipTabsList>
                <ChipTabsCarousel swipeable>
                  <ChipTabsContent value="a">
                    <Box p="x4">칩 A 본문</Box>
                  </ChipTabsContent>
                  <ChipTabsContent value="b">
                    <Box p="x4">칩 B 본문</Box>
                  </ChipTabsContent>
                  <ChipTabsContent value="c">
                    <Box p="x4">칩 C 본문</Box>
                  </ChipTabsContent>
                </ChipTabsCarousel>
              </ChipTabsRoot>
            </Case>
          </Section>

          <Section
            title="B. 오버레이 — 제스처가 없어도 뒤 화면이 밀림"
            note="swipe-back에는 모달 인지 로직이 없습니다. 게이트는 isTop과 screenState뿐이라, 화면 안에서 연 오버레이가 떠 있어도 그 위에서 오른쪽으로 쓸면 뒤 화면이 스와이프백됩니다. 오버레이 자체가 activity면 얘기가 달라지는데, 그건 맨 아래 대조군에서 봅니다."
          >
            <Case
              label="Menu (Portal)"
              note="FloatingPortal로 document.body에 붙지만 이벤트는 React 트리를 타고 올라옵니다. DOM 워크는 layer에 닿지 못해 blocker를 영영 찾지 못합니다. pressBehavior=drag라 10px 이동만으로 dismiss까지 겹칩니다."
            >
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
            </Case>

            <Case
              label="Select (Portal)"
              note="Menu와 같은 Portal + pressBehavior=drag 조합입니다."
            >
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
            </Case>

            <Case
              label="HelpBubble (Portal)"
              note="말풍선도 Portal로 빠지므로 같은 경로를 탑니다. 말풍선 위 오른쪽 스와이프를 확인하세요."
            >
              <HelpBubbleTrigger
                title="도움말"
                description="이 말풍선 위에서 오른쪽으로 쓸어보세요."
                showCloseButton
              >
                <ActionButton variant="neutralSolid">HelpBubble 열기</ActionButton>
              </HelpBubbleTrigger>
            </Case>

            <Case
              label="Snackbar"
              note="Portal 없이 position: fixed로 뜹니다. 스낵바 위 오른쪽 스와이프도 그대로 통과합니다."
            >
              <ActionButton
                variant="neutralSolid"
                onClick={() =>
                  snackbar.create({
                    render: () => (
                      <Snackbar variant="positive" message="이 위에서 오른쪽으로 쓸어보세요." />
                    ),
                  })
                }
              >
                Snackbar 띄우기
              </ActionButton>
            </Case>

            <Case
              label="Activity로 띄운 오버레이 (대조군)"
              note="같은 오버레이라도 activity로 push하면 이 화면이 top 자리를 내주고, handleTouchStart의 첫 게이트(data-screen-is-top)에서 제스처가 시작조차 하지 않습니다. 위가 NextAppScreen이 아니라 screenState도 idle에 머물러 뒤 화면은 제자리입니다. 띄운 뒤 오버레이 위에서 쓸어보세요 — 아무 일도 없어야 정상입니다."
            >
              {OVERLAY_ACTIVITIES.map(({ name, label }) => (
                <ActionButton key={name} variant="neutralSolid" onClick={() => push(name, {})}>
                  {label} activity push
                </ActionButton>
              ))}
            </Case>
          </Section>

          <Section
            title="C. 세로 제스처 — 대각선 밴드에서 동시 발화"
            note="claim 조건이 |dy| ≤ dx·tan(10°)라 순수 세로는 안전합니다. 다만 0 < dy ≤ 0.176·dx 구간은 양쪽 다 시작합니다."
          >
            <Case
              label="PullToRefresh"
              note={
                params.contentMode === "ptr"
                  ? "지금 화면의 content가 PullToRefresh입니다. 오른쪽 아래로 비스듬히 당겨보세요."
                  : "content 전체를 감싸므로 params로 다시 push해야 합니다."
              }
            >
              <ActionButton
                variant={params.contentMode === "ptr" ? "neutralWeak" : "neutralSolid"}
                onClick={() => push("ActivityNextAppScreen", { contentMode: "ptr" })}
              >
                push contentMode: ptr
              </ActionButton>
            </Case>

            <Case
              label="TimePicker (wheel-picker)"
              note="터치는 네이티브 스크롤에 맡기고 column은 touch-action: pan-y입니다. 휠 위에서 가로로 끌면 swipe-back만 반응합니다."
            >
              <TimePicker
                value={time}
                minuteStep={10}
                onValueChange={setTime}
                aria-label="약속 시간"
              />
            </Case>

            <Case
              label="DatePicker"
              note="같은 wheel-picker와 연속 스크롤을 씁니다. 달력 격자 위 가로 스와이프를 확인하세요."
            >
              <Box width="100%" maxWidth="358px">
                <DatePicker
                  today={{ year: 2026, month: 8, day: 18 }}
                  defaultValue={{ year: 2026, month: 8, day: 18 }}
                />
              </Box>
            </Case>
          </Section>

          <Section
            title="D. 가로 스크롤 — 자동 양보하지만 시작 엣지에서도 막힘"
            note="findBlockingAncestor는 overflow-x가 auto|scroll이고 scrollWidth > clientWidth면 양보합니다. 스크롤 위치는 보지 않으므로, 이미 맨 왼쪽인 스크롤러 위에서도 뒤로가기가 안 됩니다."
          >
            <Case
              label="Tabs list (트리거 넘침)"
              note="triggerLayout=hug라 트리거가 가로로 넘칩니다(fill은 늘려 맞추므로 몇 개든 넘치지 않습니다). 넘치는 동안에는 탭바 위 스와이프백이 통째로 막힙니다. iOS 네이티브는 시작 엣지에서 허용하는 동작이라 체감 차이가 큽니다."
            >
              <TabsRoot defaultValue={OVERFLOWING_TABS[0]} triggerLayout="hug">
                <TabsList>
                  {OVERFLOWING_TABS.map((label) => (
                    <TabsTrigger key={label} value={label}>
                      {label}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </TabsRoot>
            </Case>

            <Case
              label="순수 overflow-x 컨테이너"
              note="Box의 overflowX prop만으로도 같은 차단이 걸립니다. 넘치지 않으면 blocker가 아닙니다."
            >
              <Box overflowX="auto" borderRadius="r2" bg="bg.neutral">
                <HStack gap="x2" p="x2" width="900px">
                  {SWATCHES.map((n) => (
                    <Box key={n} width="140px" height="72px" borderRadius="r2" bg="bg.brandSolid" />
                  ))}
                </HStack>
              </Box>
            </Case>

            <Case
              label="ScrollFog"
              note="root가 양축 overflow: auto입니다. 가로로 넘치는 순간 blocker가 됩니다."
            >
              <Box height="100px">
                <ScrollFog>
                  <HStack gap="x2" p="x2" width="900px">
                    {SWATCHES.map((n) => (
                      <Box
                        key={n}
                        width="140px"
                        height="72px"
                        borderRadius="r2"
                        bg="bg.neutralSolid"
                      />
                    ))}
                  </HStack>
                </ScrollFog>
              </Box>
            </Case>

            <Case
              label="content 자체가 가로로 넘칠 때"
              note={
                params.contentMode === "overflowX"
                  ? "지금 화면의 content가 가로로 넘칩니다. 화면 어디에서도 full 스와이프백이 시작되지 않습니다."
                  : "content는 overflowY: scroll만 지정하지만 CSS 계산상 overflow-x가 auto가 됩니다. 1px만 넘쳐도 그 화면의 full 스와이프백이 통째로 죽습니다."
              }
            >
              <ActionButton
                variant={params.contentMode === "overflowX" ? "neutralWeak" : "neutralSolid"}
                onClick={() => push("ActivityNextAppScreen", { contentMode: "overflowX" })}
              >
                push contentMode: overflowX
              </ActionButton>
            </Case>
          </Section>

          {params.contentMode === "overflowX" && <Box width="200%" height="1px" />}
        </VStack>
      </NextAppScreenContent>
    </NextAppScreen>
  );
};

export default ActivityNextAppScreen;
