import type { ActivityComponentType } from "@stackflow/react/future";
import {
  AppBar,
  AppBarLeft,
  AppBarRight,
  AppBarMain,
  AppBarBackButton,
  AppBarIconButton,
} from "seed-design/ui/app-bar";
import { AppScreen, AppScreenContent } from "seed-design/ui/app-screen";

import { IconBellLine } from "@karrotmarket/react-monochrome-icon";
import img from "../assets/peng.jpeg";
import { useTheme } from "../contexts/ThemeContext";

declare module "@stackflow/config" {
  interface Register {
    ActivityTransparentBar: {};
  }
}

const ActivityTransparentBar: ActivityComponentType<"ActivityTransparentBar"> = () => {
  return (
    <AppScreen theme={useTheme().theme} layerOffsetTop="none" tone="transparent">
      <AppBar>
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
