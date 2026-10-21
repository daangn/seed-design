import type { StaticActivityComponentType } from "@stackflow/react/future";
import { Icon } from "@seed-design/react";
import { useFlow } from "@stackflow/react/future";
import {
  NextAppBar,
  NextAppBarBackButton,
  NextAppBarLeft,
  NextAppBarMain,
  NextAppBarRight,
  NextAppBarIconButton,
} from "seed-design/ui/next-app-bar";
import { NextAppScreen, NextAppScreenContent } from "seed-design/ui/next-app-screen";
import { IconHouseLine } from "@karrotmarket/react-monochrome-icon";

declare module "@stackflow/config" {
  interface Register {
    ActivityNotFound: {};
  }
}

const ActivityNotFound: StaticActivityComponentType<"ActivityNotFound"> = () => {
  const { push } = useFlow();

  return (
    <NextAppScreen>
      <NextAppBar>
        <NextAppBarLeft>
          <NextAppBarBackButton />
        </NextAppBarLeft>
        <NextAppBarMain title="Error" />
        <NextAppBarRight>
          <NextAppBarIconButton aria-label="Home" onClick={() => push("ActivityHome", {})}>
            <Icon svg={<IconHouseLine />} />
          </NextAppBarIconButton>
        </NextAppBarRight>
      </NextAppBar>
      <NextAppScreenContent>404 Not Found</NextAppScreenContent>
    </NextAppScreen>
  );
};

export default ActivityNotFound;
