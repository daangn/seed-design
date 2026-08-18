import { useFlow, type StaticActivityComponentType } from "@stackflow/react/future";
import {
  NextAppBar,
  NextAppBarLeft,
  NextAppBarRight,
  NextAppBarMain,
  NextAppBarBackButton,
  NextAppBarIconButton,
} from "seed-design/ui/next-app-bar";
import {
  NextAppScreen,
  NextAppScreenContent,
  type NextAppScreenProps,
} from "seed-design/ui/next-app-screen";

import { IconBellLine, IconHouseLine } from "@karrotmarket/react-monochrome-icon";
import img from "../assets/peng.jpeg";
import { VStack } from "@seed-design/react";
import { ActionButton } from "seed-design/ui/action-button";
import { SegmentedControl, SegmentedControlItem } from "seed-design/ui/segmented-control";
import { useState } from "react";
import { Switch } from "seed-design/ui/switch";
import { appScreenVariantMap } from "@seed-design/css/recipes/app-screen";

declare module "@stackflow/config" {
  interface Register {
    ActivityTransparentBar: {};
  }
}

const ActivityTransparentBar: StaticActivityComponentType<"ActivityTransparentBar"> = () => {
  const [contentOffsetTop, setContentOffsetTop] =
    useState<NonNullable<NextAppScreenProps["contentOffsetTop"]>>("none");
  const [gradient, setGradient] = useState<NonNullable<NextAppScreenProps["gradient"]>>(true);

  const { push } = useFlow();

  return (
    <NextAppScreen contentOffsetTop={contentOffsetTop} tone="transparent" gradient={gradient}>
      <NextAppBar>
        <NextAppBarLeft>
          <NextAppBarBackButton />
        </NextAppBarLeft>
        <NextAppBarMain>펭귄</NextAppBarMain>
        <NextAppBarRight>
          <NextAppBarIconButton>
            <IconBellLine />
          </NextAppBarIconButton>
          <NextAppBarIconButton>
            <IconBellLine />
          </NextAppBarIconButton>
          <NextAppBarIconButton aria-label="Home" onClick={() => push("ActivityHome", {})}>
            <IconHouseLine />
          </NextAppBarIconButton>
        </NextAppBarRight>
      </NextAppBar>
      <NextAppScreenContent>
        <VStack gap="spacingX.globalGutter">
          <img src={img} alt="penguin" />
          <VStack px="x4" gap="spacingY.componentDefault" align="center">
            <SegmentedControl
              aria-label="Content Offset Top"
              value={contentOffsetTop}
              onValueChange={(value) => setContentOffsetTop(value as typeof contentOffsetTop)}
            >
              <SegmentedControlItem value="none">none</SegmentedControlItem>
              <SegmentedControlItem value="safeArea">safeArea</SegmentedControlItem>
              <SegmentedControlItem value="appBar">appBar</SegmentedControlItem>
            </SegmentedControl>
            <Switch
              label="gradient"
              tone="neutral"
              size="24"
              checked={gradient}
              onCheckedChange={setGradient}
            />
            <ActionButton
              variant="neutralSolid"
              flexGrow
              onClick={() => push("ActivityLayerBar", {})}
            >
              ActivityLayerBar
            </ActionButton>
            <ActionButton
              variant="neutralSolid"
              flexGrow
              onClick={() => push("ActivityPluginBasicUI", {})}
            >
              ActivityPluginBasicUI
            </ActionButton>
            {appScreenVariantMap.transitionStyle.map((transitionStyle) => (
              <ActionButton
                key={transitionStyle}
                variant="neutralSolid"
                flexGrow
                onClick={() => push("ActivityTransitionStyle", { transitionStyle })}
              >
                ActivityTransitionStyle ({transitionStyle})
              </ActionButton>
            ))}
          </VStack>
          <img src={img} alt="penguin" />
          <img src={img} alt="penguin" />
          <img src={img} alt="penguin" />
        </VStack>
      </NextAppScreenContent>
    </NextAppScreen>
  );
};

export default ActivityTransparentBar;
