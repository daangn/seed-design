import {
  IconChevronRightLine,
  IconILowercaseSerifCircleLine,
  IconPersonCircleLine,
} from "@karrotmarket/react-monochrome-icon";
import { Icon } from "@seed-design/react";
import type { ActivityComponentType } from "@stackflow/react";
import { AppBar, AppBarBackButton, AppBarLeft, AppBarMain } from "../seed-design/stackflow/AppBar";
import { AppScreen, AppScreenContent } from "../seed-design/stackflow/AppScreen";
import { ActionButton } from "../seed-design/ui/action-button";
import { Avatar } from "../seed-design/ui/avatar";
import { IdentityPlaceholder } from "../seed-design/ui/identity-placeholder";
import { List, ListItem } from "../seed-design/ui/list";

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

const ActivityListItem: ActivityComponentType = () => {
  return (
    <AppScreen>
      <AppBar>
        <AppBarLeft>
          <AppBarBackButton />
        </AppBarLeft>
        <AppBarMain title="ListItem" />
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
                  <ListItem
                    key={key}
                    title={key}
                    detail={content.detail}
                    prefix={prefix.element}
                    suffix={suffix.element}
                    showDivider={showDivider}
                  />
                );
              }),
            ),
          )}
        </List>
      </AppScreenContent>
    </AppScreen>
  );
};

export default ActivityListItem;
