import { Icon } from "@seed-design/react";
import { RadioGroup } from "@seed-design/react/primitive";
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
import { List, ListDivider, ListRadioItem } from "seed-design/ui/list";
import { Radiomark } from "seed-design/ui/radio-group";
import { IdentityPlaceholder } from "seed-design/ui/identity-placeholder";
import { Avatar } from "seed-design/ui/avatar";
import {
  IconChevronRightLine,
  IconHouseLine,
  IconILowercaseSerifCircleLine,
  IconPersonCircleLine,
} from "@karrotmarket/react-monochrome-icon";

const positionVariants = [
  { key: "prefix", position: "prefix" },
  { key: "suffix", position: "suffix" },
] as const;

const contentVariants = [
  { key: "title", detail: null },
  { key: "title-detail", detail: "추가 설명이 포함된 라디오입니다" },
  { key: "title-highlighted", detail: null, highlighted: true },
  { key: "title-detail-highlighted", detail: "lorem ipsum dolor sit amet", highlighted: true },
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
  { key: "unchecked", disabled: false },
  { key: "disabled", disabled: true },
] as const;

declare module "@stackflow/config" {
  interface Register {
    ActivityListRadioItem: {};
  }
}

const ActivityListRadioItem: StaticActivityComponentType<"ActivityListRadioItem"> = () => {
  const { push } = useFlow();

  return (
    <AppScreen>
      <AppBar>
        <AppBarLeft>
          <AppBarBackButton />
        </AppBarLeft>
        <AppBarMain title="ListRadioItem" />
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
        <List asChild>
          <RadioGroup.Root
            defaultValue="prefix-title-unchecked-suffix-none"
            aria-label="ListRadioItem 예시"
          >
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
                          <Fragment key={radioValue}>
                            <ListRadioItem
                              title={radioValue}
                              value={radioValue}
                              detail={content.detail}
                              prefix={<Radiomark size="large" />}
                              disabled={state.disabled}
                              suffix={suffix.element}
                              highlighted={content.highlighted}
                            />
                            {showDivider && <ListDivider as="div" />}
                          </Fragment>
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
                          <Fragment key={radioValue}>
                            <ListRadioItem
                              value={radioValue}
                              title={radioValue}
                              detail={content.detail}
                              suffix={<Radiomark size="large" />}
                              disabled={state.disabled}
                              prefix={prefix.element}
                              highlighted={content.highlighted}
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
          </RadioGroup.Root>
        </List>
      </AppScreenContent>
    </AppScreen>
  );
};

export default ActivityListRadioItem;
