import type { StaticActivityComponentType } from "@stackflow/react/future";
import { useFlow } from "@stackflow/react/future";
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
import { List, ListDivider, ListCheckItem } from "seed-design/ui/list";
import { Checkmark } from "seed-design/ui/checkbox";
import { Icon } from "@seed-design/react";
import { IdentityPlaceholder } from "seed-design/ui/identity-placeholder";
import { Avatar } from "seed-design/ui/avatar";
import {
  IconChevronRightLine,
  IconILowercaseSerifCircleLine,
  IconPersonCircleLine,
  IconHouseLine,
} from "@karrotmarket/react-monochrome-icon";

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
  { key: "unchecked", defaultChecked: false, disabled: false, checkmarkVariant: undefined },
  { key: "checked", defaultChecked: true, disabled: false, checkmarkVariant: undefined },
  { key: "disabled", defaultChecked: false, disabled: true, checkmarkVariant: undefined },
  { key: "disabled-checked", defaultChecked: true, disabled: true, checkmarkVariant: undefined },
  { key: "ghost-unchecked", defaultChecked: false, disabled: false, checkmarkVariant: "ghost" },
  { key: "ghost-checked", defaultChecked: true, disabled: false, checkmarkVariant: "ghost" },
  { key: "ghost-disabled", defaultChecked: false, disabled: true, checkmarkVariant: "ghost" },
  {
    key: "ghost-disabled-checked",
    defaultChecked: true,
    disabled: true,
    checkmarkVariant: "ghost",
  },
] as const;

declare module "@stackflow/config" {
  interface Register {
    ActivityListCheckItem: {};
  }
}

const ActivityListCheckItem: StaticActivityComponentType<"ActivityListCheckItem"> = () => {
  const { push } = useFlow();

  return (
    <AppScreen>
      <AppBar>
        <AppBarLeft>
          <AppBarBackButton />
        </AppBarLeft>
        <AppBarMain title="ListCheckItem" />
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
        <List as="fieldset">
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
                          <ListCheckItem
                            title={key}
                            detail={content.detail}
                            prefix={<Checkmark size="large" variant={state.checkmarkVariant} />}
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
                          <ListCheckItem
                            title={key}
                            detail={content.detail}
                            suffix={<Checkmark size="large" variant={state.checkmarkVariant} />}
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

export default ActivityListCheckItem;
