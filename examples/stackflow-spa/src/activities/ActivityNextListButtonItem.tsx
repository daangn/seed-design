import {
  IconChevronRightLine,
  IconILowercaseSerifCircleLine,
  IconPersonCircleLine,
  IconHouseLine,
} from "@karrotmarket/react-monochrome-icon";
import { Icon, Portal } from "@seed-design/react";
import { useActivityZIndexBase } from "@seed-design/stackflow";
import type { StaticActivityComponentType } from "@stackflow/react/future";
import { useFlow } from "@stackflow/react/future";
import * as React from "react";
import { Fragment } from "react";
import {
  AppBar,
  AppBarBackButton,
  AppBarIconButton,
  AppBarLeft,
  AppBarMain,
  AppBarRight,
} from "seed-design/ui/app-bar";
import { AppScreen, AppScreenContent } from "seed-design/ui/app-screen";
import { ActionButton } from "seed-design/ui/action-button";
import { Avatar } from "seed-design/ui/avatar";
import { IdentityPlaceholder } from "seed-design/ui/identity-placeholder";
import {
  NextList,
  NextListDivider,
  NextListButtonItem,
  type NextListButtonItemProps,
} from "seed-design/ui/next-list";
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

const contentVariants = [
  { key: "title", detail: null },
  { key: "title-detail", detail: "lorem ipsum dolor sit amet" },
  { key: "title-highlighted", detail: null, highlighted: true },
  { key: "title-detail-highlighted", detail: "lorem ipsum dolor sit amet", highlighted: true },
  { key: "title-detail-disabled", detail: "lorem ipsum dolor sit amet", disabled: true },
  {
    key: "title-detail-highlighted-disabled",
    detail: "lorem ipsum dolor sit amet",
    highlighted: true,
    disabled: true,
  },
];

// the "buttons" suffix is the isolation test: pressing one of these ActionButtons
// must scale only that button and must not open the row's dialog.
const suffixVariants = [
  { key: "none", element: null },
  { key: "icon-info", element: <Icon svg={<IconILowercaseSerifCircleLine />} /> },
  { key: "icon-chevron", element: <Icon svg={<IconChevronRightLine />} /> },
  {
    key: "buttons",
    element: (
      <>
        <ActionButton
          size="xsmall"
          variant="neutralWeak"
          onClick={() => window.alert("Suffix button clicked")}
        >
          라벨
        </ActionButton>
        <ActionButton
          size="xsmall"
          variant="neutralWeak"
          onClick={() => window.alert("Suffix button clicked")}
        >
          라벨
        </ActionButton>
      </>
    ),
  },
];

const AlertDialogNextListButtonItem = React.forwardRef<HTMLButtonElement, NextListButtonItemProps>(
  (props, ref) => {
    const { overlayProps, setOpen } = useStepOverlay({ key: "alert-dialog" });

    return (
      <AlertDialogRoot {...overlayProps}>
        <AlertDialogTrigger asChild>
          <NextListButtonItem ref={ref} onClick={() => setOpen(true)} {...props} />
        </AlertDialogTrigger>
        <Portal>
          <AlertDialogContent layerIndex={useActivityZIndexBase({ activityOffset: +1 })}>
            <AlertDialogHeader>
              <AlertDialogTitle>consectetur</AlertDialogTitle>
              <AlertDialogDescription>
                Veniam qui nulla minim sit ad Lorem fugiat consequat ad consequat velit ullamco
                proident id.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <ActionButton onClick={() => setOpen(false)}>닫기</ActionButton>
            </AlertDialogFooter>
          </AlertDialogContent>
        </Portal>
      </AlertDialogRoot>
    );
  },
);
AlertDialogNextListButtonItem.displayName = "AlertDialogNextListButtonItem";

declare module "@stackflow/config" {
  interface Register {
    ActivityNextListButtonItem: {};
  }
}

const ActivityNextListButtonItem: StaticActivityComponentType<
  "ActivityNextListButtonItem"
> = () => {
  const { push } = useFlow();

  return (
    <AppScreen>
      <AppBar>
        <AppBarLeft>
          <AppBarBackButton />
        </AppBarLeft>
        <AppBarMain title="NextListButtonItem" />
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
        <NextList>
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
                    <AlertDialogNextListButtonItem
                      title={key}
                      detail={content.detail}
                      prefix={prefix.element}
                      suffix={suffix.element}
                      highlighted={content.highlighted}
                      disabled={content.disabled}
                    />
                    {showDivider && <NextListDivider />}
                  </Fragment>
                );
              }),
            ),
          )}
        </NextList>
      </AppScreenContent>
    </AppScreen>
  );
};

export default ActivityNextListButtonItem;
