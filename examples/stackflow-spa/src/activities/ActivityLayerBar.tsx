import { useFlow, type StaticActivityComponentType } from "@stackflow/react/future";
import {
  NextAppBar,
  NextAppBarLeft,
  NextAppBarRight,
  NextAppBarMain,
  NextAppBarIconButton,
  NextAppBarTextButton,
} from "seed-design/ui/next-app-bar";
import { NextAppScreen, NextAppScreenContent } from "seed-design/ui/next-app-screen";

import {
  IconBellLine,
  IconChevronLeftLine,
  IconHouseLine,
} from "@karrotmarket/react-monochrome-icon";
import { ActionButton } from "seed-design/ui/action-button";
import { SegmentedControl, SegmentedControlItem } from "seed-design/ui/segmented-control";
import { HStack, Icon, PrefixIcon, Text, VStack } from "@seed-design/react";
import { useState } from "react";

declare module "@stackflow/config" {
  interface Register {
    ActivityLayerBar: {};
  }
}

const BUTTON_KINDS = ["icon", "text", "longText"] as const;
type ButtonKind = (typeof BUTTON_KINDS)[number];

const BUTTON_KIND_LABELS = {
  icon: "Icon",
  text: "Text",
  longText: "Long Text",
} as const satisfies Record<ButtonKind, string>;

const SIDES = ["left", "right"] as const;

const TITLES = {
  short: "Title",
  long: "Random Long Title Hello World Commodo occaecat laboris voluptate aute magna.",
} as const;

const SUBTITLES = {
  none: undefined,
  short: "Subtitle",
  long: "Subtitle Ut voluptate in sint sunt adipisicing ex adipisicing magna ad fugiat excepteur commodo voluptate.",
} as const;

function renderButton(kind: ButtonKind, index: number, disabled: boolean) {
  switch (kind) {
    case "icon":
      return (
        <NextAppBarIconButton key={index} aria-label="Notification" disabled={disabled}>
          <Icon svg={<IconBellLine />} />
        </NextAppBarIconButton>
      );
    case "text":
      return (
        <NextAppBarTextButton key={index} disabled={disabled}>
          완료
        </NextAppBarTextButton>
      );
    case "longText":
      return (
        <NextAppBarTextButton key={index} disabled={disabled}>
          아주 긴 텍스트 버튼
        </NextAppBarTextButton>
      );
  }
}

const ActivityLayerBar: StaticActivityComponentType<"ActivityLayerBar"> = () => {
  const { push, pop } = useFlow();

  const [buttons, setButtons] = useState<Record<(typeof SIDES)[number], ButtonKind[]>>({
    left: ["icon"],
    right: ["icon"],
  });
  const [title, setTitle] = useState<keyof typeof TITLES>("long");
  const [subtitle, setSubtitle] = useState<keyof typeof SUBTITLES>("long");
  const [disabled, setDisabled] = useState(false);

  return (
    <NextAppScreen>
      <NextAppBar>
        <NextAppBarLeft>
          {buttons.left.map((kind, index) => renderButton(kind, index, disabled))}
        </NextAppBarLeft>
        <NextAppBarMain title={TITLES[title]} subtitle={SUBTITLES[subtitle]} />
        <NextAppBarRight>
          {buttons.right.map((kind, index) => renderButton(kind, index, disabled))}
        </NextAppBarRight>
      </NextAppBar>
      <NextAppScreenContent>
        <VStack gap="spacingY.componentDefault" px="spacingX.globalGutter" py="x3">
          <ActionButton variant="neutralSolid" onClick={() => push("ActivityTransparentBar", {})}>
            ActivityTransparentBar
          </ActionButton>
          <ActionButton variant="neutralWeak" onClick={() => pop()}>
            <PrefixIcon svg={<IconChevronLeftLine />} /> Back
          </ActionButton>
          <ActionButton variant="neutralWeak" onClick={() => push("ActivityHome", {})}>
            <PrefixIcon svg={<IconHouseLine />} />
            ActivityHome
          </ActionButton>

          <VStack gap="x2" align="center">
            <Text textStyle="t5Bold">Title</Text>
            <SegmentedControl
              value={title}
              onValueChange={(value) => setTitle(value as keyof typeof TITLES)}
              aria-label="Title"
            >
              <SegmentedControlItem value="short">Short</SegmentedControlItem>
              <SegmentedControlItem value="long">Long</SegmentedControlItem>
            </SegmentedControl>
          </VStack>
          <VStack gap="x2" align="center">
            <Text textStyle="t5Bold">Subtitle</Text>
            <SegmentedControl
              value={subtitle}
              onValueChange={(value) => setSubtitle(value as keyof typeof SUBTITLES)}
              aria-label="Subtitle"
            >
              <SegmentedControlItem value="none">None</SegmentedControlItem>
              <SegmentedControlItem value="short">Short</SegmentedControlItem>
              <SegmentedControlItem value="long">Long</SegmentedControlItem>
            </SegmentedControl>
          </VStack>

          <VStack gap="x2" align="center">
            <Text textStyle="t5Bold">Buttons</Text>
            <SegmentedControl
              value={disabled ? "disabled" : "enabled"}
              onValueChange={(value) => setDisabled(value === "disabled")}
              aria-label="Buttons"
            >
              <SegmentedControlItem value="enabled">Enabled</SegmentedControlItem>
              <SegmentedControlItem value="disabled">Disabled</SegmentedControlItem>
            </SegmentedControl>
          </VStack>

          {SIDES.map((side) => (
            <VStack key={side} gap="x2">
              <Text textStyle="t5Bold">{side === "left" ? "Left" : "Right"}</Text>
              <HStack gap="x2">
                {BUTTON_KINDS.map((kind) => (
                  <ActionButton
                    key={kind}
                    variant="neutralWeak"
                    flexGrow
                    onClick={() =>
                      setButtons((prev) => ({ ...prev, [side]: [...prev[side], kind] }))
                    }
                  >
                    + {BUTTON_KIND_LABELS[kind]}
                  </ActionButton>
                ))}
                <ActionButton
                  variant="neutralWeak"
                  flexGrow
                  disabled={buttons[side].length === 0}
                  onClick={() =>
                    setButtons((prev) => ({ ...prev, [side]: prev[side].slice(0, -1) }))
                  }
                >
                  Remove
                </ActionButton>
              </HStack>
            </VStack>
          ))}
        </VStack>
      </NextAppScreenContent>
    </NextAppScreen>
  );
};

export default ActivityLayerBar;
