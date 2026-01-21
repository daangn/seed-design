import type { StaticActivityComponentType } from "@stackflow/react/future";
import { useFlow } from "@stackflow/react/future";
import {
  AppBar,
  AppBarBackButton,
  AppBarLeft,
  AppBarMain,
  AppBarRight,
  AppBarIconButton,
} from "seed-design/ui/app-bar";
import { AppScreen, AppScreenContent } from "seed-design/ui/app-screen";
import { SegmentedControl, SegmentedControlItem } from "seed-design/ui/segmented-control";
import { HStack, VStack } from "@seed-design/react";
import { IconHouseLine } from "@karrotmarket/react-monochrome-icon";
import { ActionButton } from "seed-design/ui/action-button";

declare module "@stackflow/config" {
  interface Register {
    ActivitySegmentedControl: {};
  }
}

const ActivitySegmentedControl: StaticActivityComponentType<"ActivitySegmentedControl"> = () => {
  const { push } = useFlow();

  return (
    <AppScreen>
      <AppBar>
        <AppBarLeft>
          <AppBarBackButton />
        </AppBarLeft>
        <AppBarMain title="Segmented Control" />
        <AppBarRight>
          <AppBarIconButton aria-label="Home" onClick={() => push("ActivityHome", {})}>
            <IconHouseLine />
          </AppBarIconButton>
        </AppBarRight>
      </AppBar>
      <AppScreenContent>
        <VStack align="center" p="x4" gap="x4">
          <SegmentedControl defaultValue="1" aria-label="Sort options">
            <SegmentedControlItem value="1">가격 높은 순</SegmentedControlItem>
            <SegmentedControlItem value="2">할인율 높은 순</SegmentedControlItem>
            <SegmentedControlItem value="3">인기 많은 순</SegmentedControlItem>
          </SegmentedControl>
          <ActionButton variant="neutralSolid">Test</ActionButton>
        </VStack>
        <HStack align="center" p="x4" gap="x4">
          <SegmentedControl defaultValue="1" aria-label="Sort options">
            <SegmentedControlItem value="1">가격 높은 순</SegmentedControlItem>
            <SegmentedControlItem value="2">할인율 높은 순</SegmentedControlItem>
            <SegmentedControlItem value="3">인기 많은 순</SegmentedControlItem>
          </SegmentedControl>
          <ActionButton variant="neutralSolid">Test</ActionButton>
        </HStack>
      </AppScreenContent>
    </AppScreen>
  );
};

export default ActivitySegmentedControl;
