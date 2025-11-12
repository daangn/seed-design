import {
  Box,
  Divider,
  Icon,
  Portal,
  PullToRefresh,
  VStack,
  useSnackbarAdapter,
} from "@seed-design/react";
import { useActivity, useFlow, type ActivityComponentType } from "@stackflow/react/future";
import * as React from "react";
import { List, ListButtonItem } from "seed-design/ui/list";
import { ListHeader } from "seed-design/ui/list-header";
import { AppBar, AppBarIconButton, AppBarMain, AppBarRight } from "seed-design/ui/app-bar";
import { AppScreen, AppScreenContent } from "seed-design/ui/app-screen";
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
import { useStepOverlay } from "seed-design/util/use-step-overlay";
import { menuSheetCallback } from "./ActivityMenuSheet";
import { Callout } from "seed-design/ui/callout";
import { useTheme } from "../contexts/ThemeContext";
import { IconHandPointUpLine } from "@karrotmarket/react-monochrome-icon";
import { IconBellLine } from "@karrotmarket/react-monochrome-icon";
import { receive } from "@stackflow/compat-await-push";
import { useZIndexBase } from "@seed-design/stackflow";

type NavigationItem =
  | { title: string; onClick: () => void; component?: never }
  | { title: string; onClick?: never; component?: React.ReactNode };

type NavigationSection = {
  title: string;
  items: NavigationItem[];
};

declare module "@stackflow/config" {
  interface Register {
    ActivityHome: {};
  }
}

const ActivityHome: ActivityComponentType<"ActivityHome"> = () => {
  const { push } = useFlow();
  const { overlayProps, setOpen } = useStepOverlay();
  const snackbarAdapter = useSnackbarAdapter();

  const { zIndex: activityIndex } = useActivity();

  const navigationSections: NavigationSection[] = [
    {
      title: "AppBars",
      items: [
        { title: "LayerBar", onClick: () => push("ActivityLayerBar", {}) },
        { title: "TransparentBar", onClick: () => push("ActivityTransparentBar", {}) },
      ],
    },
    {
      title: "Avatars",
      items: [
        { title: "AvatarStack", onClick: () => push("ActivityAvatarStack", {}) },
        { title: "Avatar", onClick: () => push("ActivityAvatar", {}) },
      ],
    },
    {
      title: "AlertDialogs",
      items: [
        {
          title: "AlertDialog (step)",
          component: (
            <AlertDialogRoot {...overlayProps}>
              <AlertDialogTrigger asChild>
                <ListButtonItem title="AlertDialog (step)" />
              </AlertDialogTrigger>
              <Portal>
                <AlertDialogContent layerIndex={useZIndexBase()}>
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
                        onClick={() => push("ActivityChipButton", {})}
                      >
                        Push
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
      ],
    },
    {
      title: "Buttons",
      items: [
        { title: "ActionButton", onClick: () => push("ActivityActionButton", {}) },
        { title: "ToggleButton", onClick: () => push("ActivityToggleButton", {}) },
        { title: "ReactionButton", onClick: () => push("ActivityReactionButton", {}) },
      ],
    },
    {
      title: "BottomSheets",
      items: [
        { title: "BottomSheet", onClick: () => push("ActivityBottomSheet", {}) },
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
      ],
    },
    {
      title: "Chips",
      items: [
        { title: "Chip.Button", onClick: () => push("ActivityChipButton", {}) },
        { title: "Chip.Toggle", onClick: () => push("ActivityChipToggle", {}) },
      ],
    },
    {
      title: "List",
      items: [
        { title: "ListItem", onClick: () => push("ActivityListItem", {}) },
        { title: "ListButtonItem", onClick: () => push("ActivityListButtonItem", {}) },
        { title: "ListLinkItem", onClick: () => push("ActivityListLinkItem", {}) },
        { title: "ListSwitchItem", onClick: () => push("ActivityListSwitchItem", {}) },
        { title: "ListCheckItem", onClick: () => push("ActivityListCheckItem", {}) },
        { title: "ListRadioItem", onClick: () => push("ActivityListRadioItem", {}) },
      ],
    },
    {
      title: "Snackbars",
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
      ],
    },
    {
      title: "Tabs",
      items: [
        { title: "Tabs", onClick: () => push("ActivityTabs", {}) },
        { title: "AnimatedTabs", onClick: () => push("ActivityAnimatedTabs", {}) },
        { title: "SwipeableTabs", onClick: () => push("ActivitySwipeableTabs", {}) },
      ],
    },
    {
      title: "Other Components",
      items: [
        { title: "HelpBubble", onClick: () => push("ActivityHelpBubble", {}) },
        { title: "MannerTempLevel", onClick: () => push("ActivityMannerTempLevel", {}) },
        { title: "ErrorState", onClick: () => push("ActivityErrorState", {}) },
        { title: "SegmentedControl", onClick: () => push("ActivitySegmentedControl", {}) },
      ],
    },
    {
      title: "Misc",
      items: [
        {
          title: `Push to here (current activityIndex: ${activityIndex})`,
          onClick: () => push("ActivityHome", {}),
        },
        { title: "PartialDarkMode", onClick: () => push("ActivityPartialDarkMode", {}) },
        { title: "Mixed Version Test", onClick: () => push("ActivityMixedVersionTest", {}) },
      ],
    },
  ];

  return (
    <AppScreen theme={useTheme().theme}>
      <AppBar>
        <AppBarMain title="Home" />
        <AppBarRight>
          <AppBarIconButton>
            <IconBellLine />
          </AppBarIconButton>
        </AppBarRight>
      </AppBar>
      <AppScreenContent
        ptr
        onPtrRefresh={async () => {
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }}
      >
        <VStack gap="spacingY.componentDefault">
          <Box px="spacingX.globalGutter">
            <Callout
              tone="critical"
              prefixIcon={<Icon svg={<IconHandPointUpLine />} />}
              description="이 영역에서는 Pull to Refresh 동작이 발생하지 않습니다. Exercitation cillum velit
              aliquip deserunt Lorem. Eiusmod proident duis occaecat consequat veniam do commodo
              occaecat duis irure ea sunt officia cupidatat."
              {...PullToRefresh.preventPull}
            />
          </Box>
          <VStack gap="spacingY.componentDefault">
            {navigationSections.map((section, sectionIndex) => (
              <>
                <VStack key={section.title}>
                  <ListHeader>{section.title}</ListHeader>
                  <List>
                    {section.items.map((item) =>
                      item.component ? (
                        <React.Fragment key={item.title}>{item.component}</React.Fragment>
                      ) : (
                        <ListButtonItem
                          key={item.title}
                          onClick={item.onClick}
                          title={item.title}
                        />
                      ),
                    )}
                  </List>
                </VStack>
                {sectionIndex < navigationSections.length - 1 && <Divider />}
              </>
            ))}
          </VStack>
        </VStack>
      </AppScreenContent>
    </AppScreen>
  );
};

export default ActivityHome;
