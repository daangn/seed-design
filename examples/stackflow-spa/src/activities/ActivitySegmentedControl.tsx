import type { ActivityComponentType } from "@stackflow/react";
import { AppBar, AppBarBackButton, AppBarLeft, AppBarMain } from "../seed-design/stackflow/AppBar";
import { AppScreen, AppScreenContent } from "../seed-design/stackflow/AppScreen";
import { SegmentedControl, SegmentedControlItem } from "../seed-design/ui/segmented-control";
import { Stack } from "@seed-design/react";

const ActivitySegmentedControl: ActivityComponentType = () => {
  return (
    <AppScreen>
      <AppBar>
        <AppBarLeft>
          <AppBarBackButton />
        </AppBarLeft>
        <AppBarMain title="Segmented Control" />
      </AppBar>
      <AppScreenContent>
        <Stack alignItems="center">
          <SegmentedControl defaultValue="1">
            <SegmentedControlItem value="1">가격 높은 순</SegmentedControlItem>
            <SegmentedControlItem value="2">할인율 높은 순</SegmentedControlItem>
            <SegmentedControlItem value="3">인기 많은 순</SegmentedControlItem>
          </SegmentedControl>
        </Stack>
      </AppScreenContent>
    </AppScreen>
  );
};

export default ActivitySegmentedControl;
