import type { ActivityComponentType } from "@stackflow/react";
import {
  AppBar,
  AppBarLeft,
  AppBarRight,
  AppBarMain,
  AppBarBackButton,
  AppBarIconButton,
} from "../seed-design/stackflow/AppBar";
import { AppScreen, AppScreenContent } from "../seed-design/stackflow/AppScreen";

import { IconBellLine } from "@karrotmarket/react-monochrome-icon";

const ActivityLayerBar: ActivityComponentType = () => {
  return (
    <AppScreen>
      <AppBar tone="layer" divider>
        <AppBarLeft>
          <AppBarBackButton />
        </AppBarLeft>
        <AppBarMain title="Random Long Title Hello World" subtitle="Subtitle" />
        <AppBarRight>
          <AppBarIconButton>
            <IconBellLine />
          </AppBarIconButton>
          <AppBarIconButton>
            <IconBellLine />
          </AppBarIconButton>
          <AppBarIconButton>
            <IconBellLine />
          </AppBarIconButton>
          <AppBarIconButton>
            <IconBellLine />
          </AppBarIconButton>
        </AppBarRight>
      </AppBar>
      <AppScreenContent />
    </AppScreen>
  );
};

export default ActivityLayerBar;
