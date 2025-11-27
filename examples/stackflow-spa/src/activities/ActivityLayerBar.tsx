import { useFlow, type StaticActivityComponentType } from "@stackflow/react/future";
import {
  AppBar,
  AppBarLeft,
  AppBarRight,
  AppBarMain,
  AppBarBackButton,
  AppBarIconButton,
} from "seed-design/ui/app-bar";
import { AppScreen, AppScreenContent } from "seed-design/ui/app-screen";

import { IconBellLine, IconHouseLine } from "@karrotmarket/react-monochrome-icon";
import { ActionButton } from "seed-design/ui/action-button";

declare module "@stackflow/config" {
  interface Register {
    ActivityLayerBar: {};
  }
}

const ActivityLayerBar: StaticActivityComponentType<"ActivityLayerBar"> = () => {
  const { push } = useFlow();

  return (
    <AppScreen>
      <AppBar divider>
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
          <AppBarIconButton aria-label="Home" onClick={() => push("ActivityHome", {})}>
            <IconHouseLine />
          </AppBarIconButton>
        </AppBarRight>
      </AppBar>
      <AppScreenContent>
        <ActionButton
          variant="neutralSolid"
          flexGrow
          onClick={() => push("ActivityTransparentBar", {})}
        >
          ActivityTransparentBar
        </ActionButton>
      </AppScreenContent>
    </AppScreen>
  );
};

export default ActivityLayerBar;
