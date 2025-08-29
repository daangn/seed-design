import { RadioGroup, Icon } from "@seed-design/react";
import type { ActivityComponentType } from "@stackflow/react";
import { AppBar, AppBarBackButton, AppBarLeft, AppBarMain } from "../seed-design/stackflow/AppBar";
import { AppScreen, AppScreenContent } from "../seed-design/stackflow/AppScreen";
import { List, ListItemRadio } from "../seed-design/ui/list";
import { IdentityPlaceholder } from "../seed-design/ui/identity-placeholder";
import { Avatar } from "../seed-design/ui/avatar";
import {
  IconChevronRightLine,
  IconILowercaseSerifCircleLine,
  IconPersonCircleLine,
} from "@karrotmarket/react-monochrome-icon";
import { ActionButton } from "../seed-design/ui/action-button";

const positionVariants = [
  { key: "prefix", position: "prefix" },
  { key: "suffix", position: "suffix" },
] as const;

const contentVariants = [
  { key: "title", detail: null },
  { key: "title-detail", detail: "추가 설명이 포함된 라디오입니다" },
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

const stateVariants = [
  { key: "unchecked", disabled: false },
  { key: "disabled", disabled: true },
] as const;

const ActivityListItemRadio: ActivityComponentType = () => {
  return (
    <AppScreen>
      <AppBar>
        <AppBarLeft>
          <AppBarBackButton />
        </AppBarLeft>
        <AppBarMain title="ListItemRadio" />
      </AppBar>
      <AppScreenContent
        ptr
        onPtrRefresh={async () => {
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }}
      >
        <List>
          <RadioGroup.Root defaultValue="prefix-title-unchecked-suffix-none">
            {positionVariants.map((position) =>
              contentVariants.map((content) =>
                stateVariants.map((state) => {
                  switch (position.position) {
                    case "prefix": {
                      return suffixVariants.map((suffix, suffixIndex) => {
                        const isLastSuffix = suffixIndex === suffixVariants.length - 1;
                        const isLastState =
                          state.key === stateVariants[stateVariants.length - 1].key;
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

                        const radioValue = `${position.key}-${content.key}-${state.key}-suffix-${suffix.key}`;

                        return (
                          <ListItemRadio
                            key={radioValue}
                            title={radioValue}
                            value={radioValue}
                            detail={content.detail}
                            position={position.position}
                            disabled={state.disabled}
                            showDivider={showDivider}
                            suffix={suffix.element}
                          />
                        );
                      });
                    }

                    case "suffix": {
                      return prefixVariants.map((prefix, prefixIndex) => {
                        const isLastPrefix = prefixIndex === prefixVariants.length - 1;
                        const isLastState =
                          state.key === stateVariants[stateVariants.length - 1].key;
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

                        const radioValue = `${position.key}-${content.key}-${state.key}-prefix-${prefix.key}`;

                        return (
                          <ListItemRadio
                            key={radioValue}
                            value={radioValue}
                            title={radioValue}
                            detail={content.detail}
                            position={position.position}
                            disabled={state.disabled}
                            showDivider={showDivider}
                            prefix={prefix.element}
                          />
                        );
                      });
                    }
                  }

                  // unreachable
                  return undefined;
                }),
              ),
            )}
          </RadioGroup.Root>
        </List>
      </AppScreenContent>
    </AppScreen>
  );
};

export default ActivityListItemRadio;
