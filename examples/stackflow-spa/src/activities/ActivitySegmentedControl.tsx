import type { ActivityComponentType } from "@stackflow/react/future";
import { AppBar, AppBarBackButton, AppBarLeft, AppBarMain } from "seed-design/ui/app-bar";
import { AppScreen, AppScreenContent } from "seed-design/ui/app-screen";
import { SegmentedControl, SegmentedControlItem } from "seed-design/ui/segmented-control";
import { VStack } from "@seed-design/react";
import { useTheme } from "../contexts/ThemeContext";

declare module "@stackflow/config" {
  interface Register {
    ActivitySegmentedControl: {};
  }
}

const ActivitySegmentedControl: ActivityComponentType<"ActivitySegmentedControl"> = () => {
  return (
    <AppScreen theme={useTheme().theme}>
      <AppBar>
        <AppBarLeft>
          <AppBarBackButton />
        </AppBarLeft>
        <AppBarMain title="Segmented Control" />
      </AppBar>
      <AppScreenContent>
        <VStack align="center">
          <SegmentedControl defaultValue="1" aria-label="Sort options">
            <SegmentedControlItem value="1">가격 높은 순</SegmentedControlItem>
            <SegmentedControlItem value="2">할인율 높은 순</SegmentedControlItem>
            <SegmentedControlItem value="3">인기 많은 순</SegmentedControlItem>
          </SegmentedControl>
        </VStack>
      </AppScreenContent>
    </AppScreen>
  );
};

export default ActivitySegmentedControl;
