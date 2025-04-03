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
import img from "../assets/peng.jpeg";

const ActivityTransparentBar: ActivityComponentType = () => {
  return (
    <AppScreen layerOffsetTop="none">
      <AppBar tone="transparent">
        <AppBarLeft>
          <AppBarBackButton />
        </AppBarLeft>
        <AppBarMain>야옹</AppBarMain>
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
      <AppScreenContent>
        <img src={img} alt="penguin" />
        <div style={{ height: 800 }} />
      </AppScreenContent>
    </AppScreen>
  );
};

export default ActivityTransparentBar;
