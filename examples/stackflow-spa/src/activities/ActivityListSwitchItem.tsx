import type { ActivityComponentType } from "@stackflow/react";
import { Fragment } from "react";
import { AppBar, AppBarBackButton, AppBarLeft, AppBarMain } from "../seed-design/stackflow/AppBar";
import { AppScreen, AppScreenContent } from "../seed-design/stackflow/AppScreen";
import { List, ListDivider, ListSwitchItem } from "../seed-design/ui/list";
import { Icon } from "@seed-design/react";
import { IdentityPlaceholder } from "../seed-design/ui/identity-placeholder";
import { Avatar } from "../seed-design/ui/avatar";
import {
  IconChevronRightLine,
  IconILowercaseSerifCircleLine,
  IconPersonCircleLine,
} from "@karrotmarket/react-monochrome-icon";
import { SwitchMark } from "../seed-design/ui/switch";

const positionVariants = [
  { key: "prefix", position: "prefix" },
  { key: "suffix", position: "suffix" },
] as const;

const contentVariants = [
  { key: "title", detail: null },
  { key: "title-detail", detail: "추가 설명이 포함된 체크박스입니다" },
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
];

const stateVariants = [
  { key: "unchecked", defaultChecked: false, disabled: false, tone: "brand" },
  { key: "checked", defaultChecked: true, disabled: false, tone: "brand" },
  { key: "disabled", defaultChecked: false, disabled: true, tone: "brand" },
  { key: "disabled-checked", defaultChecked: true, disabled: true, tone: "brand" },
  { key: "neutral-unchecked", defaultChecked: false, disabled: false, tone: "neutral" },
  { key: "neutral-checked", defaultChecked: true, disabled: false, tone: "neutral" },
  { key: "neutral-disabled", defaultChecked: false, disabled: true, tone: "neutral" },
  { key: "neutral-disabled-checked", defaultChecked: true, disabled: true, tone: "neutral" },
] as const;

const ActivityListSwitchItem: ActivityComponentType = () => {
  return (
    <AppScreen>
      <AppBar>
        <AppBarLeft>
          <AppBarBackButton />
        </AppBarLeft>
        <AppBarMain title="ListSwitchItem" />
      </AppBar>
      <AppScreenContent
        ptr
        onPtrRefresh={async () => {
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }}
      >
        <List>
          {positionVariants.map((position) =>
            contentVariants.map((content) =>
              stateVariants.map((state) => {
                switch (position.position) {
                  case "prefix": {
                    return suffixVariants.map((suffix, suffixIndex) => {
                      const isLastSuffix = suffixIndex === suffixVariants.length - 1;
                      const isLastState = state.key === stateVariants[stateVariants.length - 1].key;
                      const isLastContent =
                        content.key === contentVariants[contentVariants.length - 1].key;
                      const isLastPosition =
                        position.key === positionVariants[positionVariants.length - 1].key;
                      const showDivider = !(
                        isLastSuffix &&
                        isLastState &&
                        isLastContent &&
                        isLastPosition
                      );

                      const key = `${position.key}-${content.key}-${state.key}-suffix-${suffix.key}`;

                      return (
                        <Fragment key={key}>
                          <ListSwitchItem
                            title={key}
                            detail={content.detail}
                            prefix={<SwitchMark tone={state.tone} />}
                            defaultChecked={state.defaultChecked}
                            disabled={state.disabled}
                            suffix={suffix.element}
                          />
                          {showDivider && <ListDivider as="div" />}
                        </Fragment>
                      );
                    });
                  }

                  case "suffix": {
                    return prefixVariants.map((prefix, prefixIndex) => {
                      const isLastPrefix = prefixIndex === prefixVariants.length - 1;
                      const isLastState = state.key === stateVariants[stateVariants.length - 1].key;
                      const isLastContent =
                        content.key === contentVariants[contentVariants.length - 1].key;
                      const isLastPosition =
                        position.key === positionVariants[positionVariants.length - 1].key;
                      const showDivider = !(
                        isLastPrefix &&
                        isLastState &&
                        isLastContent &&
                        isLastPosition
                      );

                      const key = `${position.key}-${content.key}-${state.key}-prefix-${prefix.key}`;

                      return (
                        <Fragment key={key}>
                          <ListSwitchItem
                            title={key}
                            detail={content.detail}
                            suffix={<SwitchMark tone={state.tone} />}
                            defaultChecked={state.defaultChecked}
                            disabled={state.disabled}
                            prefix={prefix.element}
                          />
                          {showDivider && <ListDivider as="div" />}
                        </Fragment>
                      );
                    });
                  }
                }

                // unreachable
                return undefined;
              }),
            ),
          )}
        </List>
      </AppScreenContent>
    </AppScreen>
  );
};

export default ActivityListSwitchItem;
