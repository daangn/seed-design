import { Grid, Portal, VStack, useSnackbarAdapter } from "@seed-design/react";
import { vars } from "@seed-design/css/vars";
import { useActivity, useFlow, type StaticActivityComponentType } from "@stackflow/react/future";
import * as React from "react";
import { List, ListButtonItem } from "seed-design/ui/list";
import { ListHeader } from "seed-design/ui/list-header";
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
import { appScreenVariantMap } from "@seed-design/css/recipes/app-screen";

import {
  IconBellLine,
  IconPlusLine,
  IconPencilLine,
  IconTrashcanLine,
} from "@karrotmarket/react-monochrome-icon";
import { receive } from "@stackflow/compat-await-push";
import { useActivityZIndexBase } from "@seed-design/stackflow";

type NavigationItem =
  | { title: string; onClick: () => void; component?: never }
  | { title: string; onClick?: never; component?: React.ReactNode };

type NavigationSection = {
  title: string;
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

  const navigationSections: NavigationSection[] = [
    // 화면 껍데기 자체를 prop으로 조작하는 화면. push/pop 옵션이 주제인 화면은 Stack & Transition으로 간다.
    {
      title: "App Screen",
      items: [
        { title: "AppBar 슬롯 · 긴 제목", onClick: () => push("ActivityLayerBar", {}) },
        { title: "AppScreen transparent", onClick: () => push("ActivityTransparentBar", {}) },
        { title: "@stackflow/plugin-basic-ui", onClick: () => push("ActivityPluginBasicUI", {}) },
      ],
    },
    {
      title: "Stack & Transition",
      items: [
        { title: "Pop Test (중복 pop 가드)", onClick: () => push("ActivityPopTest", {}) },
        {
          title: "animate: false Test (밀림 버그)",
          onClick: () => push("ActivityAnimateFalseTest", {}),
        },
        {
          title: `홈 다시 push (깊이: ${activityIndex})`,
          onClick: () => push("ActivityHome", {}),
        },
        ...appScreenVariantMap.transitionStyle.map((transitionStyle) => ({
          title: `전환 스타일: ${transitionStyle}`,
          onClick: () => push("ActivityTransitionStyle", { transitionStyle }),
        })),
      ],
    },
    // 화면 아래에서 올라오는 시트. 중앙·가장자리 고정 오버레이는 Dialog & Panel로 간다.
    {
      title: "Bottom Sheet",
      items: [
        { title: "BottomSheet", onClick: () => push("ActivityBottomSheet", {}) },
        {
          title: "BottomSheet modal 토글",
          onClick: () => push("ActivityBottomSheetModalTest", {}),
        },
        {
          title: "BottomSheet (TextField only)",
          onClick: () => push("ActivityBottomSheetTextField", {}),
        },
        {
          title: "BottomSheet snapPoints × 입력 포커스",
          onClick: () => push("ActivityBottomSheetInputFocus", {}),
        },
        {
          title: "BottomSheet Keyboard Playground",
          onClick: () => push("ActivityBottomSheetKeyboardPlayground", {}),
        },
        {
          title: "BottomSheet × AlertDialog (step)",
          onClick: () => push("ActivityBottomSheetWithAlertDialogStep", {}),
        },
        {
          title: "BottomSheet × AlertDialog (activity)",
          onClick: () => push("ActivityNestedBottomSheet", {}),
        },
        {
          title: "MenuSheet",
          component: (
            <DialogPushTrigger
              callbackActivity={menuSheetCallback}
              params={{}}
              onPop={(result) => {
                console.log(result?.action);
              }}
            >
              <ListButtonItem title="MenuSheet" />
            </DialogPushTrigger>
          ),
        },
        {
          title: "SwipeableMenuSheet",
          component: (
            <DialogPushTrigger
              callbackActivity={swipeableMenuSheetCallback}
              params={{}}
              onPop={(result) => {
                console.log(result?.action);
              }}
            >
              <ListButtonItem title="SwipeableMenuSheet" />
            </DialogPushTrigger>
          ),
        },
      ],
    },
    // 화면 중앙 또는 가장자리에 고정되는 오버레이. Responsive 계열은 좁은 화면에서 시트로 렌더되지만
    // 검증 대상 API가 ResponsiveSidePanel/ResponsiveDialog이므로 여기에 둔다.
    {
      title: "Dialog & Panel",
      items: [
        {
          title: "AlertDialog (step)",
          component: (
            <AlertDialogRoot {...overlayProps}>
              <AlertDialogTrigger asChild>
                <ListButtonItem title="AlertDialog (step)" />
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
          title: "AlertDialog (activity)",
          onClick: async () => {
            const result = await receive<any>(push("ActivityAlertDialog", {}));
            console.log(result.message);
          },
        },
        { title: "SidePanel", onClick: () => push("ActivitySidePanel", {}) },
        {
          title: "ResponsiveSidePanel",
          onClick: () => push("ActivityResponsiveSidePanel", {}),
        },
        {
          title: "ResponsiveDialog",
          onClick: () => push("ActivityResponsiveDialog", {}),
        },
      ],
    },
    // 트리거 요소에 앵커되는 오버레이의 배치·정렬.
    {
      title: "Menu & Popover",
      items: [
        { title: "Menu", onClick: () => push("ActivityMenu", {}) },
        {
          title: "Menu from ListButtonItem",
          component: (
            <MenuRoot size="medium" matchReferenceWidth>
              <MenuTrigger asChild>
                <ListButtonItem title="Menu from ListButtonItem" />
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
        { title: "HelpBubble", onClick: () => push("ActivityHelpBubble", {}) },
      ],
    },
    // PTR 제스처의 발동·차단 조건. 스와이프백 제스처는 App Screen으로 간다.
    {
      title: "Pull to Refresh",
      items: [
        { title: "PullToRefresh", onClick: () => push("ActivityPullToRefreshPreview", {}) },
        { title: "PullToRefresh × Tabs", onClick: () => push("ActivityPullToRefreshTabs", {}) },
        {
          title: "PullToRefresh (preventPull)",
          onClick: () => push("ActivityPullToRefreshPreventPull", {}),
        },
        {
          title: "Article preventPull (텍스트 선택)",
          onClick: () => push("ActivityArticlePreventPull", {}),
        },
      ],
    },
    // 콘텐츠 묶음 사이를 이동시키는 컨트롤. 화면 스택 이동은 Stack & Transition으로 간다.
    {
      title: "Navigation",
      items: [
        { title: "Tabs", onClick: () => push("ActivityTabs", {}) },
        { title: "AnimatedTabs", onClick: () => push("ActivityAnimatedTabs", {}) },
        { title: "SwipeableTabs", onClick: () => push("ActivitySwipeableTabs", {}) },
        {
          title: "Tabs autoHeight × 지연 로딩",
          onClick: () => push("ActivityTabsAutoHeightLazy", {}),
        },
        {
          title: "ChipTabs × ScrollFog",
          onClick: () => push("ActivityChipTabsScrollFog", {}),
        },
        { title: "Pagination", onClick: () => push("ActivityPagination", {}) },
        { title: "SideNavigation", onClick: () => replace("ActivitySideNavigation", {}) },
      ],
    },
    // List 계열 아이템의 prefix/suffix 조합. 그 안에 쓰이는 Checkbox·Switch·Radio 자체는 Form으로 간다.
    {
      title: "List",
      items: [
        { title: "ListItem", onClick: () => push("ActivityListItem", {}) },
        { title: "ListImageFrame", onClick: () => push("ActivityListImageFrame", {}) },
        { title: "ListButtonItem", onClick: () => push("ActivityListButtonItem", {}) },
        { title: "ListLinkItem", onClick: () => push("ActivityListLinkItem", {}) },
        { title: "ListSwitchItem", onClick: () => push("ActivityListSwitchItem", {}) },
        { title: "ListCheckItem", onClick: () => push("ActivityListCheckItem", {}) },
        { title: "ListRadioItem", onClick: () => push("ActivityListRadioItem", {}) },
      ],
    },
    // 값을 입력·선택받는 컨트롤. 누르기만 하는 버튼·칩은 Button & Chip으로 간다.
    {
      title: "Form",
      items: [
        { title: "Switch", onClick: () => push("ActivitySwitch", {}) },
        { title: "Checkbox", onClick: () => push("ActivityCheckbox", {}) },
        { title: "QuantityPicker", onClick: () => push("ActivityQuantityPicker", {}) },
        { title: "RadioGroup", onClick: () => push("ActivityRadioGroup", {}) },
        { title: "SegmentedControl", onClick: () => push("ActivitySegmentedControl", {}) },
        { title: "Select", onClick: () => push("ActivitySelect", {}) },
        { title: "TimePicker", onClick: () => push("ActivityTimePicker", {}) },
        { title: "WheelPicker", onClick: () => push("ActivityWheelPicker", {}) },
        { title: "AttachmentField", onClick: () => push("ActivityAttachmentField", {}) },
        {
          title: "AttachmentDisplayField",
          onClick: () => push("ActivityAttachmentDisplayField", {}),
        },
        { title: "Form 조합 예제", onClick: () => push("ActivityForm", {}) },
      ],
    },
    {
      title: "Button & Chip",
      items: [
        { title: "ActionButton", onClick: () => push("ActivityActionButton", {}) },
        { title: "ToggleButton", onClick: () => push("ActivityToggleButton", {}) },
        { title: "ReactionButton", onClick: () => push("ActivityReactionButton", {}) },
        { title: "Chip.Button", onClick: () => push("ActivityChipButton", {}) },
        { title: "Chip.Toggle", onClick: () => push("ActivityChipToggle", {}) },
      ],
    },
    // 정보를 보여주기만 하는 컴포넌트와 화면 전체 상태 표현.
    {
      title: "Content Display",
      items: [
        { title: "Avatar", onClick: () => push("ActivityAvatar", {}) },
        { title: "AvatarStack", onClick: () => push("ActivityAvatarStack", {}) },
        { title: "Badge", onClick: () => push("ActivityBadge", {}) },
        { title: "MannerTempBadge", onClick: () => push("ActivityMannerTempLevel", {}) },
        { title: "Accordion", onClick: () => push("ActivityAccordion", {}) },
        { title: "ErrorState", onClick: () => push("ActivityErrorState", {}) },
        { title: "ResultSection", onClick: () => push("ActivityResultSection", {}) },
      ],
    },
    {
      title: "Snackbar",
      items: [
        {
          title: "Snackbar",
          onClick: () =>
            snackbarAdapter.create({
              render: () => <Snackbar message="Disco Party!" actionLabel="Dance" />,
            }),
        },
        {
          title: "Snackbar (positive)",
          onClick: () =>
            snackbarAdapter.create({
              render: () => (
                <Snackbar variant="positive" message="Disco Party!" actionLabel="Dance" />
              ),
            }),
        },
        {
          title: "Snackbar (critical)",
          onClick: () =>
            snackbarAdapter.create({
              render: () => (
                <Snackbar variant="critical" message="Disco Party!" actionLabel="Dance" />
              ),
            }),
        },
        {
          title: "Snackbar (queued)",
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
          title: "Snackbar (dismiss+setTimeout workaround)",
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
    // 특정 컴포넌트가 아니라 그 아래 스타일 레이어(토큰·스타일 프롭·컬러 모드·폰트 배율·CSS 변수 엔진)를
    // 보는 화면.
    {
      title: "Foundation",
      items: [
        { title: "Box margin 프롭", onClick: () => push("ActivityMarginPlayground", {}) },
        { title: "IACVT Leak Check (구형 iOS)", onClick: () => push("ActivityIacvtLeak", {}) },
        { title: "SidePanel IACVT (구형 iOS)", onClick: () => push("ActivityIacvtSidePanel", {}) },
        { title: "Overlay IACVT (구형 iOS)", onClick: () => push("ActivityIacvtOverlay", {}) },
        { title: "Margin/Bleed IACVT (구형 iOS)", onClick: () => push("ActivityIacvtMargin", {}) },
        {
          title: "IACVT: initial 폴백 가설 (순수 CSS)",
          onClick: () => push("ActivityIacvtExperiment", {}),
        },
        {
          title: "Font Multiplier Layout",
          onClick: () => push("ActivityFontMultiplierLayout", {}),
        },
        { title: "Typography Scale", onClick: () => push("ActivityTypographyScale", {}) },
        { title: "누름 축소 피드백", onClick: () => push("ActivityScaleFeedback", {}) },
        { title: "PartialDarkMode", onClick: () => push("ActivityPartialDarkMode", {}) },
        { title: "v2 변수 × v3 토큰 혼용", onClick: () => push("ActivityMixedVersionTest", {}) },
      ],
    },
  ];

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
        ptr
        // layer의 배경색은 recipe가 layerDefault로 고정하고 style prop을 받지 않는다.
        // PTR로 당겼을 때 드러나는 영역까지 카드 배경과 이어지려면 여기서 덮어야 한다.
        style={{ backgroundColor: vars.$color.bg.layerBasement }}
        onPtrRefresh={async () => {
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }}
      >
        <VStack pb="safeArea" minHeight="100%">
          <Grid columns={{ base: 1, md: 2, lg: 3, xl: 4 }} gap="x4" px="x4" pb="x4">
            {navigationSections.map((section) => (
              <VStack key={section.title} py="x1_5" borderRadius="r3_5" bg="bg.layerDefault">
                <ListHeader as="h2">{section.title}</ListHeader>
                <List itemBorderRadius="r2">
                  {section.items.map((item) =>
                    item.component ? (
                      <React.Fragment key={item.title}>{item.component}</React.Fragment>
                    ) : (
                      <ListButtonItem key={item.title} onClick={item.onClick} title={item.title} />
                    ),
                  )}
                </List>
              </VStack>
            ))}
          </Grid>
        </VStack>
      </AppScreenContent>
    </AppScreen>
  );
};

export default ActivityHome;
