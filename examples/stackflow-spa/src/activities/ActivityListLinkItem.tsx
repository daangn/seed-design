import {
  IconChevronRightLine,
  IconHouseLine,
  IconILowercaseSerifCircleLine,
  IconPersonCircleLine,
} from "@karrotmarket/react-monochrome-icon";
import { Icon } from "@seed-design/react";
import type { ActivityComponentType } from "@stackflow/react/future";
import { useFlow } from "@stackflow/react/future";
import { Fragment } from "react";
import { AppBar, AppBarBackButton, AppBarIconButton, AppBarLeft, AppBarMain, AppBarRight } from "seed-design/ui/app-bar";
import { AppScreen, AppScreenContent } from "seed-design/ui/app-screen";
import { ActionButton } from "seed-design/ui/action-button";
import { Avatar } from "seed-design/ui/avatar";
import { IdentityPlaceholder } from "seed-design/ui/identity-placeholder";
import { List, ListDivider, ListLinkItem } from "seed-design/ui/list";

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

declare module "@stackflow/config" {
  interface Register {
    ActivityListLinkItem: {};
  }
}

const ActivityListLinkItem: ActivityComponentType<"ActivityListLinkItem"> = () => {
  const { push } = useFlow();

  return (
    <AppScreen>
      <AppBar>
        <AppBarLeft>
          <AppBarBackButton />
        </AppBarLeft>
        <AppBarMain title="ListLinkItem" />
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
                    <ListLinkItem
                      href="https://example.com"
                      target="_blank"
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

export default ActivityListLinkItem;
