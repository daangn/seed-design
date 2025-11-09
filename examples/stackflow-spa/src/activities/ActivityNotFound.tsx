import type { ActivityComponentType } from "@stackflow/react/future";
import { AppBar, AppBarBackButton, AppBarLeft, AppBarMain } from "seed-design/ui/app-bar";
import { AppScreen, AppScreenContent } from "seed-design/ui/app-screen";
import { useTheme } from "../contexts/ThemeContext";

declare module "@stackflow/config" {
  interface Register {
    ActivityNotFound: {};
  }
}

const ActivityNotFound: ActivityComponentType<"ActivityNotFound"> = () => {
  return (
    <AppScreen theme={useTheme().theme}>
      <AppBar>
        <AppBarLeft>
          <AppBarBackButton />
        </AppBarLeft>
        <AppBarMain>Error</AppBarMain>
      </AppBar>
      <AppScreenContent>404 Not Found</AppScreenContent>
    </AppScreen>
  );
};

export default ActivityNotFound;
