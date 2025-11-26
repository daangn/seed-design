import {
  IconChevronRightLine,
  IconILowercaseSerifCircleLine,
  IconPersonCircleLine,
  IconHouseLine,
} from "@karrotmarket/react-monochrome-icon";
import { Icon } from "@seed-design/react";
import { useStepFlow, useFlow, type ActivityComponentType } from "@stackflow/react/future";
import * as React from "react";
import { Fragment } from "react";
import { AppBar, AppBarBackButton, AppBarIconButton, AppBarLeft, AppBarMain, AppBarRight } from "seed-design/ui/app-bar";
import { AppScreen, AppScreenContent } from "seed-design/ui/app-screen";
import { ActionButton } from "seed-design/ui/action-button";
import { Avatar } from "seed-design/ui/avatar";
import { IdentityPlaceholder } from "seed-design/ui/identity-placeholder";
import { List, ListDivider, ListButtonItem, type ListButtonItemProps } from "seed-design/ui/list";
import {
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogRoot,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "seed-design/ui/alert-dialog";
import { useStepOverlay } from "seed-design/stackflow/use-step-overlay";

import { useActivityZIndexBase } from "@seed-design/stackflow";

const contentVariants = [
  { key: "title", detail: null },
  { key: "title-detail", detail: "lorem ipsum dolor sit amet" },
];

const prefixVariants = [
  { key: "none", element: null },
  { key: "icon", element: <Icon svg={<IconPersonCircleLine />} /> },
  {
    key: "avatar",
    element: (
      <Avatar
        size="48"
        src="https://avatars.githubusercontent.com/u/54893898?v=4"
        fallback={<IdentityPlaceholder />}
      />
    ),
  },
];

const suffixVariants = [
  { key: "none", element: null },
  { key: "icon-info", element: <Icon svg={<IconILowercaseSerifCircleLine />} /> },
  { key: "icon-chevron", element: <Icon svg={<IconChevronRightLine />} /> },
  {
    key: "buttons",
    element: (
      <>
        <ActionButton size="xsmall" variant="neutralWeak">
          라벨
        </ActionButton>
        <ActionButton size="xsmall" variant="neutralWeak">
          라벨
        </ActionButton>
      </>
    ),
  },
];

const AlertDialogListButtonItem = React.forwardRef<HTMLButtonElement, ListButtonItemProps>(
  (props, ref) => {
    const { overlayProps, setOpen } = useStepOverlay({ key: "alert-dialog" });
    const { popStep } = useStepFlow("ActivityListButtonItem");

    return (
      <AlertDialogRoot {...overlayProps}>
        <AlertDialogTrigger asChild>
          <ListButtonItem ref={ref} onClick={() => setOpen(true)} {...props} />
        </AlertDialogTrigger>
        <AlertDialogContent layerIndex={useActivityZIndexBase()}>
          <AlertDialogHeader>
            <AlertDialogTitle>consectetur</AlertDialogTitle>
            <AlertDialogDescription>
              Veniam qui nulla minim sit ad Lorem fugiat consequat ad consequat velit ullamco
              proident id.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <ActionButton onClick={() => popStep()}>닫기</ActionButton>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogRoot>
    );
  },
);
AlertDialogListButtonItem.displayName = "AlertDialogListButtonItem";

declare module "@stackflow/config" {
  interface Register {
    ActivityListButtonItem: {};
  }
}

const ActivityListButtonItem: ActivityComponentType<"ActivityListButtonItem"> = () => {
  const { push } = useFlow();

  return (
    <AppScreen>
      <AppBar>
        <AppBarLeft>
          <AppBarBackButton />
        </AppBarLeft>
        <AppBarMain title="ListButtonItem" />
        <AppBarRight>
          <AppBarIconButton aria-label="Home" onClick={() => push("ActivityHome", {})}>
            <IconHouseLine />
          </AppBarIconButton>
        </AppBarRight>
      </AppBar>
      <AppScreenContent
        ptr
        onPtrRefresh={async () => {
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }}
      >
        <List>
          {prefixVariants.map((prefix) =>
            contentVariants.map((content) =>
              suffixVariants.map((suffix, suffixIndex) => {
                const isLastSuffix = suffixIndex === suffixVariants.length - 1;
                const isLastContent =
                  content.key === contentVariants[contentVariants.length - 1].key;
                const isLastPrefix = prefix.key === prefixVariants[prefixVariants.length - 1].key;
                const showDivider = !(isLastSuffix && isLastContent && isLastPrefix);

                const key = `${prefix.key}-${content.key}-${suffix.key}`;

                return (
                  <Fragment key={key}>
                    <AlertDialogListButtonItem
                      title={key}
                      detail={content.detail}
                      prefix={prefix.element}
                      suffix={suffix.element}
                    />
                    {showDivider && <ListDivider />}
                  </Fragment>
                );
              }),
            ),
          )}
        </List>
      </AppScreenContent>
    </AppScreen>
  );
};

export default ActivityListButtonItem;
