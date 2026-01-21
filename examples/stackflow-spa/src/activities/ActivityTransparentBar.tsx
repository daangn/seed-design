import { useFlow, type StaticActivityComponentType } from "@stackflow/react/future";
import {
  AppBar,
  AppBarLeft,
  AppBarRight,
  AppBarMain,
  AppBarBackButton,
  AppBarIconButton,
} from "seed-design/ui/app-bar";
import { AppScreen, AppScreenContent, type AppScreenProps } from "seed-design/ui/app-screen";

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
  const [layerOffsetTop, setLayerOffsetTop] =
    useState<NonNullable<AppScreenProps["layerOffsetTop"]>>("none");
  const [gradient, setGradient] = useState<NonNullable<AppScreenProps["gradient"]>>(true);

  const { push } = useFlow();

  return (
    <AppScreen layerOffsetTop={layerOffsetTop} tone="transparent" gradient={gradient}>
      <AppBar>
        <AppBarLeft>
          <AppBarBackButton />
        </AppBarLeft>
        <AppBarMain>펭귄</AppBarMain>
        <AppBarRight>
          <AppBarIconButton>
            <IconBellLine />
          </AppBarIconButton>
          <AppBarIconButton>
            <IconBellLine />
          </AppBarIconButton>
          <AppBarIconButton aria-label="Home" onClick={() => push("ActivityHome", {})}>
            <IconHouseLine />
          </AppBarIconButton>
        </AppBarRight>
      </AppBar>
      <AppScreenContent>
        <VStack gap="spacingX.globalGutter">
          <img src={img} alt="penguin" />
          <VStack px="x4" gap="spacingY.componentDefault" align="center">
            <SegmentedControl
              aria-label="Layer Offset Top"
              value={layerOffsetTop}
              onValueChange={(value) => setLayerOffsetTop(value as typeof layerOffsetTop)}
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
      </AppScreenContent>
    </AppScreen>
  );
};

export default ActivityTransparentBar;
