import {
  Box,
  Divider,
  Portal,
  PullToRefresh,
  VStack,
  useSnackbarAdapter,
} from "@seed-design/react";
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
import { Callout } from "seed-design/ui/callout";
import { MenuRoot, MenuTrigger, MenuContent, MenuGroup, MenuItem } from "seed-design/ui/menu";
import { appScreenVariantMap } from "@seed-design/css/recipes/app-screen";

import {
  IconHandPointUpLine,
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
  const { push } = useFlow();
  const { overlayProps, setOpen } = useStepOverlay({ key: "alert-dialog" });
  const snackbarAdapter = useSnackbarAdapter();

  const { zIndex: activityIndex } = useActivity();

  const navigationSections: NavigationSection[] = [
    {
      title: "AppBar",
      items: [
        { title: "LayerBar", onClick: () => push("ActivityLayerBar", {}) },
        { title: "TransparentBar", onClick: () => push("ActivityTransparentBar", {}) },
      ],
    },
    {
      title: "AppScreen",
      items: [
        {
          title: `Push to here (current activityIndex: ${activityIndex})`,
          onClick: () => push("ActivityHome", {}),
        },
        { title: "@stackflow/plugin-basic-ui", onClick: () => push("ActivityPluginBasicUI", {}) },
        ...appScreenVariantMap.transitionStyle.map((transitionStyle) => ({
          title: `ActivityTransitionStyle (${transitionStyle})`,
          onClick: () => push("ActivityTransitionStyle", { transitionStyle }),
        })),
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
      title: "Menu",
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
      ],
    },
    {
      title: "BottomSheets",
      items: [
        { title: "BottomSheet", onClick: () => push("ActivityBottomSheet", {}) },
        {
          title: "BottomSheet Modal Test",
          onClick: () => push("ActivityBottomSheetModalTest", {}),
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
        { title: "ListImageFrame", onClick: () => push("ActivityListImageFrame", {}) },
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
      title: "Forms",
      items: [
        { title: "Switch", onClick: () => push("ActivitySwitch", {}) },
        { title: "Checkbox", onClick: () => push("ActivityCheckbox", {}) },
        { title: "RadioGroup", onClick: () => push("ActivityRadioGroup", {}) },
        { title: "SegmentedControl", onClick: () => push("ActivitySegmentedControl", {}) },
        { title: "AttachmentField", onClick: () => push("ActivityAttachmentField", {}) },
        { title: "Form", onClick: () => push("ActivityForm", {}) },
      ],
    },
    {
      title: "Other Components",
      items: [
        { title: "HelpBubble", onClick: () => push("ActivityHelpBubble", {}) },
        { title: "Badge", onClick: () => push("ActivityBadge", {}) },
        { title: "MannerTempLevel", onClick: () => push("ActivityMannerTempLevel", {}) },
        { title: "ErrorState", onClick: () => push("ActivityErrorState", {}) },
        { title: "ResultSection", onClick: () => push("ActivityResultSection", {}) },
        { title: "SideNavigation", onClick: () => push("ActivitySideNavigation", {}) },
      ],
    },
    {
      title: "Misc",
      items: [
        { title: "Font Scaling", onClick: () => push("ActivityFontScaling", {}) },
        { title: "PartialDarkMode", onClick: () => push("ActivityPartialDarkMode", {}) },
        { title: "Mixed Version Test", onClick: () => push("ActivityMixedVersionTest", {}) },
      ],
    },
  ];

  return (
    <AppScreen transitionStyle={params.transitionStyle}>
      <AppBar>
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
        onPtrRefresh={async () => {
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }}
      >
        <VStack gap="spacingY.componentDefault" pb="safeArea">
          <Box px="spacingX.globalGutter">
            <Callout
              tone="critical"
              prefixIcon={<IconHandPointUpLine />}
              title="foobar"
              description="이 영역에서는 Pull to Refresh 동작이 발생하지 않습니다. Exercitation cillum velit
              aliquip deserunt Lorem. Eiusmod proident duis occaecat consequat veniam do commodo
              occaecat duis irure ea sunt officia cupidatat."
              {...PullToRefresh.preventPull}
            />
          </Box>
          <VStack gap="spacingY.componentDefault" pb="spacingY.componentDefault">
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
