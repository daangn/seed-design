import {
  Box,
  Grid,
  HStack,
  Icon,
  Portal,
  Text,
  VStack,
  useSnackbarAdapter,
} from "@seed-design/react";
import { vars } from "@seed-design/css/vars";
import type { InferActivityParams, RegisteredActivityName } from "@stackflow/config";
import { useActivity, useFlow, type StaticActivityComponentType } from "@stackflow/react/future";
import * as React from "react";
import { List, ListButtonItem } from "seed-design/ui/list";
import {
  AppBar,
  AppBarBackButton,
  AppBarIconButton,
  AppBarLeft,
  AppBarMain,
  AppBarRight,
} from "seed-design/ui/app-bar";
import { AppScreen, AppScreenContent, type AppScreenProps } from "seed-design/ui/app-screen";
import { DialogPushTrigger } from "seed-design/stackflow/DialogPushTrigger";
import { ActionButton } from "seed-design/ui/action-button";
import {
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogRoot,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "seed-design/ui/alert-dialog";
import { Snackbar } from "seed-design/ui/snackbar";
import { useStepOverlay } from "seed-design/stackflow/use-step-overlay";
import { menuSheetCallback } from "./ActivityMenuSheet";
import { swipeableMenuSheetCallback } from "./ActivitySwipeableMenuSheet";
import { MenuRoot, MenuTrigger, MenuContent, MenuGroup, MenuItem } from "seed-design/ui/menu";
import { ChipTabsList, ChipTabsRoot, ChipTabsTrigger } from "seed-design/ui/chip-tabs";
import { appScreenVariantMap } from "@seed-design/css/recipes/app-screen";

import {
  IconBellLine,
  IconPlusLine,
  IconPencilLine,
  IconTrashcanLine,
} from "@karrotmarket/react-monochrome-icon";
import {
  AppWindowIcon,
  CompassIcon,
  ImageIcon,
  LayersIcon,
  LayoutTemplateIcon,
  ListIcon,
  MessageSquareDashedIcon,
  MousePointerClickIcon,
  PaletteIcon,
  PanelBottomIcon,
  RefreshCwIcon,
  SquareMenuIcon,
  TextCursorInputIcon,
  type LucideIcon,
} from "lucide-react";
import { receive } from "@stackflow/compat-await-push";
import { useActivityZIndexBase } from "@seed-design/stackflow";

// 칩 스트립과 섹션 제목 사이 간격(px). 그리드 위쪽 여백, 제목이 고정되는 자리, 칩 점프
// 오프셋이 이 값을 함께 써서 스크롤 전후로 간격이 달라지지 않는다.
const HEADER_GAP = 8;

type NavigationItem =
  | { title: string; detail?: string; onClick: () => void; component?: never }
  | { title: string; detail?: never; onClick?: never; component?: React.ReactNode };

type NavigationSection = {
  title: string;
  icon: LucideIcon;
  items: NavigationItem[];
};

declare module "@stackflow/config" {
  interface Register {
    ActivityHome: {
      transitionStyle?: AppScreenProps["transitionStyle"];
    };
  }
}

const ActivityHome: StaticActivityComponentType<"ActivityHome"> = ({ params }) => {
  const { push, replace } = useFlow();
  const { overlayProps, setOpen } = useStepOverlay({ key: "alert-dialog" });
  const snackbarAdapter = useSnackbarAdapter();

  const { zIndex: activityIndex } = useActivity();

  // 항목이 여는 액티비티 이름을 detail로 함께 내보낸다. 이름이 곧 파일 이름이라, 데모에서 본
  // 화면의 소스를 찾을 때 목록에서 읽은 이름을 그대로 검색할 수 있다.
  const to = <K extends RegisteredActivityName>(activity: K, params: InferActivityParams<K>) => ({
    detail: activity,
    onClick: () => push(activity, params),
  });

  const navigationSections: NavigationSection[] = [
    {
      title: "AppScreen",
      icon: LayersIcon,
      items: [
        { title: "App Bar 슬롯과 긴 제목", ...to("ActivityLayerBar", {}) },
        { title: "투명 App Bar", ...to("ActivityTransparentBar", {}) },
        { title: "@stackflow/plugin-basic-ui", ...to("ActivityPluginBasicUI", {}) },
        { title: "중복 pop 가드", ...to("ActivityPopTest", {}) },
        { title: "animate: false 밀림 버그 [Legacy]", ...to("ActivityAnimateFalseTest", {}) },
        { title: "AppScreen 미리보기 [Legacy]", ...to("ActivityAppScreenPreview", {}) },
        { title: "투명 AppScreen [Legacy]", ...to("ActivityAppScreenTransparent", {}) },
        {
          title: "IntersectionObserver [Legacy]",
          ...to("ActivityAppScreenIntersectionObserver", {}),
        },
        { title: `홈 다시 push (깊이: ${activityIndex})`, ...to("ActivityHome", {}) },
        ...appScreenVariantMap.transitionStyle.map((transitionStyle) => ({
          title: `전환: ${transitionStyle} [Legacy]`,
          ...to("ActivityTransitionStyle", { transitionStyle }),
        })),
      ],
    },
    {
      title: "NextAppScreen",
      icon: LayoutTemplateIcon,
      items: [
        { title: "기본", ...to("ActivityNextAppScreen", {}) },
        { title: "투명", ...to("ActivityNextAppScreenTransparent", {}) },
      ],
    },
    {
      title: "Drawer",
      icon: PanelBottomIcon,
      items: [
        { title: "Bottom Sheet", ...to("ActivityBottomSheet", {}) },
        { title: "Bottom Sheet modal 토글", ...to("ActivityBottomSheetModalTest", {}) },
        { title: "Text Field만 있는 Bottom Sheet", ...to("ActivityBottomSheetTextField", {}) },
        {
          title: "Bottom Sheet snapPoints와 입력 포커스",
          ...to("ActivityBottomSheetInputFocus", {}),
        },
        {
          title: "Bottom Sheet Keyboard Playground",
          ...to("ActivityBottomSheetKeyboardPlayground", {}),
        },
        {
          title: "Bottom Sheet 위 Alert Dialog (step)",
          ...to("ActivityBottomSheetWithAlertDialogStep", {}),
        },
        {
          title: "Bottom Sheet 위 Alert Dialog (activity)",
          ...to("ActivityNestedBottomSheet", {}),
        },
        {
          title: "Menu Sheet",
          component: (
            <DialogPushTrigger
              callbackActivity={menuSheetCallback}
              params={{}}
              onPop={(result) => {
                console.log(result?.action);
              }}
            >
              <ListButtonItem title="Menu Sheet" detail="ActivityMenuSheet" />
            </DialogPushTrigger>
          ),
        },
        {
          title: "Swipeable Menu Sheet",
          component: (
            <DialogPushTrigger
              callbackActivity={swipeableMenuSheetCallback}
              params={{}}
              onPop={(result) => {
                console.log(result?.action);
              }}
            >
              <ListButtonItem title="Swipeable Menu Sheet" detail="ActivitySwipeableMenuSheet" />
            </DialogPushTrigger>
          ),
        },
        { title: "Side Panel", ...to("ActivitySidePanel", {}) },
        { title: "Responsive Side Panel", ...to("ActivityResponsiveSidePanel", {}) },
      ],
    },
    {
      title: "Dialog",
      icon: AppWindowIcon,
      items: [
        {
          title: "Alert Dialog (step)",
          component: (
            <AlertDialogRoot {...overlayProps}>
              <AlertDialogTrigger asChild>
                <ListButtonItem title="Alert Dialog (step)" />
              </AlertDialogTrigger>
              <Portal>
                <AlertDialogContent layerIndex={useActivityZIndexBase({ activityOffset: 1 })}>
                  <AlertDialogHeader>
                    <AlertDialogTitle>제목</AlertDialogTitle>
                    <AlertDialogDescription>
                      Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <VStack gap="x2">
                      <ActionButton onClick={() => setOpen(false)}>확인</ActionButton>
                      <ActionButton
                        variant="neutralSolid"
                        onClick={() => {
                          setOpen(false);
                          push("ActivityChipButton", {});
                        }}
                      >
                        ActivityChipButton
                      </ActionButton>
                    </VStack>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </Portal>
            </AlertDialogRoot>
          ),
        },
        {
          title: "Alert Dialog (activity)",
          detail: "ActivityAlertDialog",
          onClick: async () => {
            const result = await receive<any>(push("ActivityAlertDialog", {}));
            console.log(result.message);
          },
        },
        { title: "Responsive Dialog", ...to("ActivityResponsiveDialog", {}) },
      ],
    },
    {
      title: "Menu & Popover",
      icon: SquareMenuIcon,
      items: [
        { title: "Menu", ...to("ActivityMenu", {}) },
        {
          title: "List Button Item으로 여는 Menu",
          component: (
            <MenuRoot size="medium" matchReferenceWidth>
              <MenuTrigger asChild>
                <ListButtonItem title="List Button Item으로 여는 Menu" />
              </MenuTrigger>
              <MenuContent>
                <MenuGroup>
                  <MenuItem label="추가" prefixIcon={<IconPlusLine />} />
                  <MenuItem label="수정" prefixIcon={<IconPencilLine />} />
                </MenuGroup>
                <MenuGroup>
                  <MenuItem label="삭제" tone="critical" prefixIcon={<IconTrashcanLine />} />
                </MenuGroup>
              </MenuContent>
            </MenuRoot>
          ),
        },
        { title: "Help Bubble", ...to("ActivityHelpBubble", {}) },
      ],
    },
    {
      title: "Pull to Refresh",
      icon: RefreshCwIcon,
      items: [
        { title: "기본", ...to("ActivityNextPullToRefreshPreview", {}) },
        { title: "기본 [Legacy]", ...to("ActivityPullToRefreshPreview", {}) },
        { title: "Tabs와 조합", ...to("ActivityPullToRefreshTabs", {}) },
        { title: "preventPull", ...to("ActivityNextPullToRefreshPreventPull", {}) },
        { title: "preventPull [Legacy]", ...to("ActivityPullToRefreshPreventPull", {}) },
        { title: "Article 텍스트 선택 중 당김 차단", ...to("ActivityArticlePreventPull", {}) },
      ],
    },
    {
      title: "Navigation",
      icon: CompassIcon,
      items: [
        { title: "Tabs", ...to("ActivityTabs", {}) },
        { title: "Animated Tabs", ...to("ActivityAnimatedTabs", {}) },
        { title: "Swipeable Tabs", ...to("ActivitySwipeableTabs", {}) },
        { title: "Tabs autoHeight와 지연 로딩", ...to("ActivityTabsAutoHeightLazy", {}) },
        { title: "Chip Tabs와 Scroll Fog", ...to("ActivityChipTabsScrollFog", {}) },
        { title: "Pagination", ...to("ActivityPagination", {}) },
        {
          title: "Side Navigation",
          detail: "ActivitySideNavigation",
          onClick: () => replace("ActivitySideNavigation", {}),
        },
      ],
    },
    {
      title: "List",
      icon: ListIcon,
      items: [
        { title: "List Item", ...to("ActivityListItem", {}) },
        { title: "List Image Frame", ...to("ActivityListImageFrame", {}) },
        { title: "List Button Item", ...to("ActivityListButtonItem", {}) },
        { title: "List Link Item", ...to("ActivityListLinkItem", {}) },
        { title: "List Switch Item", ...to("ActivityListSwitchItem", {}) },
        { title: "List Check Item", ...to("ActivityListCheckItem", {}) },
        { title: "List Radio Item", ...to("ActivityListRadioItem", {}) },
      ],
    },
    {
      title: "Form",
      icon: TextCursorInputIcon,
      items: [
        { title: "Switch", ...to("ActivitySwitch", {}) },
        { title: "Checkbox", ...to("ActivityCheckbox", {}) },
        { title: "Quantity Picker", ...to("ActivityQuantityPicker", {}) },
        { title: "Radio Group", ...to("ActivityRadioGroup", {}) },
        { title: "Segmented Control", ...to("ActivitySegmentedControl", {}) },
        { title: "Select", ...to("ActivitySelect", {}) },
        { title: "Time Picker", ...to("ActivityTimePicker", {}) },
        { title: "Wheel Picker", ...to("ActivityWheelPicker", {}) },
        { title: "Attachment Field", ...to("ActivityAttachmentField", {}) },
        { title: "Attachment Display Field", ...to("ActivityAttachmentDisplayField", {}) },
        { title: "여러 필드 조합", ...to("ActivityForm", {}) },
      ],
    },
    {
      title: "Button & Chip",
      icon: MousePointerClickIcon,
      items: [
        { title: "Action Button", ...to("ActivityActionButton", {}) },
        { title: "Toggle Button", ...to("ActivityToggleButton", {}) },
        { title: "Reaction Button", ...to("ActivityReactionButton", {}) },
        { title: "Chip Button", ...to("ActivityChipButton", {}) },
        { title: "Chip Toggle", ...to("ActivityChipToggle", {}) },
      ],
    },
    {
      title: "Content Display",
      icon: ImageIcon,
      items: [
        { title: "Avatar", ...to("ActivityAvatar", {}) },
        { title: "Avatar Stack", ...to("ActivityAvatarStack", {}) },
        { title: "Badge", ...to("ActivityBadge", {}) },
        { title: "Manner Temp Badge", ...to("ActivityMannerTempLevel", {}) },
        { title: "Accordion", ...to("ActivityAccordion", {}) },
        { title: "Error State", ...to("ActivityErrorState", {}) },
        { title: "Result Section", ...to("ActivityResultSection", {}) },
      ],
    },
    {
      title: "Snackbar",
      icon: MessageSquareDashedIcon,
      items: [
        {
          title: "기본",
          onClick: () =>
            snackbarAdapter.create({
              render: () => <Snackbar message="Disco Party!" actionLabel="Dance" />,
            }),
        },
        {
          title: "positive",
          onClick: () =>
            snackbarAdapter.create({
              render: () => (
                <Snackbar variant="positive" message="Disco Party!" actionLabel="Dance" />
              ),
            }),
        },
        {
          title: "critical",
          onClick: () =>
            snackbarAdapter.create({
              render: () => (
                <Snackbar variant="critical" message="Disco Party!" actionLabel="Dance" />
              ),
            }),
        },
        {
          title: "queued",
          onClick: () =>
            snackbarAdapter.create({
              strategy: "queued",
              render: () => <Snackbar message="Queued Snackbar" />,
            }),
        },
        {
          // 기존 스낵바를 먼저 닫고 다음 tick에 새 스낵바를 띄우는 패턴.
          // dismiss 상태 전이가 적용된 뒤에 create가 실행되므로
          // 항상 새 스낵바부터 활성화되는 것을 보장한다.
          title: "dismiss 후 setTimeout 우회",
          onClick: () => {
            snackbarAdapter.dismiss();
            setTimeout(() => {
              snackbarAdapter.create({
                render: () => <Snackbar message="Workaround Snackbar" />,
              });
            }, 0);
          },
        },
      ],
    },
    {
      title: "Foundation",
      icon: PaletteIcon,
      items: [
        { title: "Box margin prop", ...to("ActivityMarginPlayground", {}) },
        { title: "IACVT 상속 누수 (구형 iOS)", ...to("ActivityIacvtLeak", {}) },
        { title: "Side Panel IACVT (구형 iOS)", ...to("ActivityIacvtSidePanel", {}) },
        { title: "오버레이 IACVT (구형 iOS)", ...to("ActivityIacvtOverlay", {}) },
        { title: "margin·bleed IACVT (구형 iOS)", ...to("ActivityIacvtMargin", {}) },
        { title: "IACVT: initial 폴백 가설 (순수 CSS)", ...to("ActivityIacvtExperiment", {}) },
        { title: "폰트 배율 레이아웃", ...to("ActivityFontMultiplierLayout", {}) },
        { title: "타이포그래피 스케일", ...to("ActivityTypographyScale", {}) },
        { title: "Scale Feedback", ...to("ActivityScaleFeedback", {}) },
        { title: "부분 다크 모드", ...to("ActivityPartialDarkMode", {}) },
        { title: "v2 변수 × v3 토큰 혼용", ...to("ActivityMixedVersionTest", {}) },
      ],
    },
  ];

  const scrollContainerRef = React.useRef<HTMLDivElement>(null);
  const stripRef = React.useRef<HTMLDivElement>(null);
  const [stripHeight, setStripHeight] = React.useState(0);
  // 등록이 렌더 순서대로 일어나므로 Map의 키 순서가 곧 화면에 놓인 섹션 순서다.
  const sectionRefs = React.useRef(new Map<string, HTMLElement>());
  const isJumpingRef = React.useRef(false);
  const [activeSection, setActiveSection] = React.useState(navigationSections[0].title);

  React.useEffect(() => {
    const strip = stripRef.current;
    if (!strip) return;

    const observer = new ResizeObserver(() => setStripHeight(strip.offsetHeight));
    observer.observe(strip);
    return () => observer.disconnect();
  }, []);

  React.useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer) return;

    const visibleTitles = new Set<string>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const title = (entry.target as HTMLElement).dataset.sectionTitle;
          if (!title) continue;

          if (entry.isIntersecting) visibleTitles.add(title);
          else visibleTitles.delete(title);
        }

        if (isJumpingRef.current) return;

        // 띠에 걸린 마지막 행에서 첫 섹션을 고른다. 마지막 섹션을 고르면 여러 열로 렌더될 때 한
        // 행이 통째로 띠에 들어와 오른쪽 끝 카드가 활성이 되고, 첫 행을 고르면 이미 위로 밀려나는
        // 행이 다음 행이 화면을 다 채울 때까지 활성으로 남는다.
        const visible = [...sectionRefs.current.entries()].filter(([title]) =>
          visibleTitles.has(title),
        );
        if (visible.length > 0) {
          const rowTop = Math.max(...visible.map(([, el]) => el.getBoundingClientRect().top));
          const current = visible.find(
            ([, el]) => Math.abs(el.getBoundingClientRect().top - rowTop) < 1,
          )?.[0];
          if (current) setActiveSection(current);
        }
      },
      // 스크롤 컨테이너 위쪽 20%만 관측한다.
      { root: scrollContainer, rootMargin: "0px 0px -80% 0px" },
    );

    for (const section of sectionRefs.current.values()) {
      observer.observe(section);
    }
    return () => observer.disconnect();
  }, []);

  React.useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer) return;

    let settleTimer: ReturnType<typeof setTimeout>;
    const releaseWhenSettled = () => {
      if (!isJumpingRef.current) return;

      clearTimeout(settleTimer);
      settleTimer = setTimeout(() => {
        isJumpingRef.current = false;
      }, 120);
    };

    scrollContainer.addEventListener("scroll", releaseWhenSettled, { passive: true });
    return () => {
      clearTimeout(settleTimer);
      scrollContainer.removeEventListener("scroll", releaseWhenSettled);
    };
  }, []);

  function jumpToSection(title: string) {
    const scrollContainer = scrollContainerRef.current;
    const section = sectionRefs.current.get(title);
    if (!scrollContainer || !section) return;

    // 부드러운 스크롤이 중간 섹션들을 훑고 지나가는 동안 활성 칩이 튀지 않도록 동기화를 멈춘다.
    isJumpingRef.current = true;
    setActiveSection(title);
    scrollContainer.scrollTo({
      top:
        scrollContainer.scrollTop +
        section.getBoundingClientRect().top -
        scrollContainer.getBoundingClientRect().top -
        Number.parseFloat(getComputedStyle(scrollContainer).paddingTop) -
        stripHeight -
        HEADER_GAP,
      behavior: "smooth",
    });
  }

  return (
    <AppScreen transitionStyle={params.transitionStyle}>
      <AppBar bg="bg.layerBasement">
        {activityIndex > 0 && (
          <AppBarLeft>
            <AppBarBackButton />
          </AppBarLeft>
        )}
        <AppBarMain title="Home" />
        <AppBarRight>
          <AppBarIconButton>
            <IconBellLine />
          </AppBarIconButton>
        </AppBarRight>
      </AppBar>
      <AppScreenContent
        ref={scrollContainerRef}
        ptr
        // layer의 배경색은 recipe가 layerDefault로 고정하고 style prop을 받지 않는다.
        // PTR로 당겼을 때 드러나는 영역까지 카드 배경과 이어지려면 여기서 덮어야 한다.
        style={{ backgroundColor: vars.$color.bg.layerBasement }}
        onPtrRefresh={async () => {
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }}
      >
        <VStack pb="safeArea" minHeight="100%">
          <Box ref={stripRef} position="sticky" top={0} zIndex={2} bg="bg.layerBasement">
            <ChipTabsRoot
              value={activeSection}
              onValueChange={jumpToSection}
              variant="neutralSolid"
            >
              <ChipTabsList style={{ padding: "8px 16px" }}>
                {navigationSections.map((section) => (
                  <ChipTabsTrigger key={section.title} value={section.title}>
                    {section.title}
                  </ChipTabsTrigger>
                ))}
              </ChipTabsList>
            </ChipTabsRoot>
          </Box>
          <Grid
            columns={{ base: 1, md: 2, lg: 3, xl: 4 }}
            gap="x5"
            px="x4"
            pt={`${HEADER_GAP}px`}
            pb="x4"
          >
            {navigationSections.map((section) => (
              <VStack
                key={section.title}
                data-section-title={section.title}
                ref={(node) => {
                  if (node) sectionRefs.current.set(section.title, node);
                  else sectionRefs.current.delete(section.title);
                }}
              >
                {/*
                  카드 위쪽 여백을 섹션 gap이 아니라 제목의 pb로 준다. 쉬고 있을 때의 간격은
                  같으면서, 제목이 고정됐을 때는 그 8px까지 제목의 배경이 덮어서 카드 항목이
                  제목 글자에 닿지 않는다.
                */}
                <HStack
                  align="center"
                  gap="x1_5"
                  px="x1"
                  pt="x1"
                  pb="x2"
                  position="sticky"
                  top={`${stripHeight + HEADER_GAP}px`}
                  zIndex={1}
                  bg="bg.layerBasement"
                >
                  {/*
                    제목이 스트립에서 HEADER_GAP만큼 떨어져 고정되므로 그 사이에 틈이 생긴다.
                    제목의 배경을 그 틈까지 위로 늘려서 카드 항목이 제목 위로 새어 나오지 않게
                    한다. 섹션 사이 간격이 이보다 넓어서, 고정되기 전에는 그 간격 안에 들어가
                    페이지 배경과 겹치므로 보이지 않는다.
                  */}
                  <Box
                    position="absolute"
                    bottom="100%"
                    left={0}
                    right={0}
                    height={`${HEADER_GAP}px`}
                    bg="bg.layerBasement"
                  />
                  <Icon svg={<section.icon />} size="x4_5" color="fg.neutralSubtle" />
                  <Text as="h2" textStyle="t5Medium" color="fg.neutral">
                    {section.title}
                  </Text>
                  {/*
                    카드의 둥근 윗변을 제목 아래에 고정하는 캡. 제목이 sticky라서 그 자식으로
                    두면 별도 오프셋 계산 없이 제목을 따라다닌다.

                    칠하는 것은 두 위쪽 모서리의 바깥 쐐기뿐이다. 바깥으로 퍼지는 box-shadow는
                    둥근 테두리 모양의 바깥만 칠하고, clip-path가 그 그림자를 다시 사각형 안으로
                    자르므로, 사각형 안이면서 곡선 바깥인 쐐기만 남는다. 가운데가 비어 있어서
                    항목이 캡 높이만큼 늦게 드러나지 않고 카드 윗변에서 바로 곡선을 따라 잘린다.

                    칠하는 색이 페이지 배경과 같아서, 여러 열에서 카드가 먼저 끝나고 제목만 남는
                    구간에서는 캡이 보이지 않는다.
                  */}
                  <Box
                    position="absolute"
                    top="100%"
                    left={0}
                    right={0}
                    height="x3_5"
                    borderTopLeftRadius="r3_5"
                    borderTopRightRadius="r3_5"
                    style={{
                      boxShadow: `0 0 0 ${vars.$radius.r3_5} ${vars.$color.bg.layerBasement}`,
                      clipPath: "inset(0)",
                    }}
                  />
                </HStack>
                <VStack py="x1_5" borderRadius="r3_5" bg="bg.layerDefault">
                  <List itemBorderRadius="r2">
                    {section.items.map((item) =>
                      item.component ? (
                        <React.Fragment key={item.title}>{item.component}</React.Fragment>
                      ) : (
                        <ListButtonItem
                          key={item.title}
                          onClick={item.onClick}
                          title={item.title}
                          detail={item.detail}
                        />
                      ),
                    )}
                  </List>
                </VStack>
              </VStack>
            ))}
          </Grid>
        </VStack>
      </AppScreenContent>
    </AppScreen>
  );
};

export default ActivityHome;
