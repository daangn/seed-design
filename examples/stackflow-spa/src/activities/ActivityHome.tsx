import { Divider, VStack, useSnackbarAdapter } from "@seed-design/react";
import { receive } from "@stackflow/compat-await-push";
import type { ActivityComponentType } from "@stackflow/react";
import * as React from "react";
import { List, ListButtonItem } from "../seed-design/ui/list";
import { ListHeader } from "../seed-design/ui/list-header";
import {
  AppBar,
  AppBarBackButton,
  AppBarIconButton,
  AppBarLeft,
  AppBarMain,
  AppBarRight,
} from "../seed-design/stackflow/AppBar";
import { AppScreen, AppScreenContent } from "../seed-design/stackflow/AppScreen";
import { DialogPushTrigger } from "../seed-design/stackflow/DialogPushTrigger";
import { ActionButton } from "../seed-design/ui/action-button";
import {
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogRoot,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../seed-design/ui/alert-dialog";
import { Snackbar } from "../seed-design/ui/snackbar";
import { useStepDialog } from "../seed-design/util/use-step-dialog";
import { useFlow } from "../stackflow";
import { menuSheetCallback } from "./ActivityMenuSheet";
import { IconBellLine } from "@karrotmarket/react-monochrome-icon";

type NavigationItem =
  | { title: string; onClick: () => void; component?: never }
  | { title: string; onClick?: never; component?: React.ReactNode };

type NavigationSection = {
  title: string;
  items: NavigationItem[];
};

const ActivityHome: ActivityComponentType = () => {
  const { push } = useFlow();
  const { dialogProps, setOpen } = useStepDialog();
  const snackbarAdapter = useSnackbarAdapter();

  const navigationSections: NavigationSection[] = React.useMemo(
    () =>
      [
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
                <AlertDialogRoot {...dialogProps}>
                  <AlertDialogTrigger asChild>
                    <ListButtonItem title="AlertDialog (step)" />
                  </AlertDialogTrigger>
                  <AlertDialogContent>
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
            { title: "PartialDarkMode", onClick: () => push("ActivityPartialDarkMode", {}) },
            { title: "Mixed Version Test", onClick: () => push("ActivityMixedVersionTest", {}) },
          ],
        },
      ] satisfies NavigationSection[],
    [setOpen, push, dialogProps, snackbarAdapter.create],
  );

  return (
    <AppScreen>
      <AppBar>
        <AppBarLeft>
          <AppBarBackButton />
        </AppBarLeft>
        <AppBarRight>
          <AppBarIconButton>
            <IconBellLine />
          </AppBarIconButton>
        </AppBarRight>
        <AppBarMain title="Home" />
      </AppBar>

      <AppScreenContent
        ptr
        onPtrRefresh={async () => {
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }}
      >
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
                      <ListButtonItem key={item.title} onClick={item.onClick} title={item.title} />
                    ),
                  )}
                </List>
              </VStack>
              {sectionIndex < navigationSections.length - 1 && <Divider />}
            </>
          ))}
        </VStack>
      </AppScreenContent>
    </AppScreen>
  );
};

export default ActivityHome;
