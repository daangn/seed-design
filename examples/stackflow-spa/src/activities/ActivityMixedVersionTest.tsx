import { Box, VStack } from "@seed-design/react";
import type { StaticActivityComponentType } from "@stackflow/react/future";
import { useFlow } from "@stackflow/react/future";
import { IconHouseLine } from "@karrotmarket/react-monochrome-icon";
import {
  AppBar,
  AppBarBackButton,
  AppBarIconButton,
  AppBarLeft,
  AppBarMain,
  AppBarRight,
} from "seed-design/ui/app-bar";
import { AppScreen, AppScreenContent } from "seed-design/ui/app-screen";

declare module "@stackflow/config" {
  interface Register {
    ActivityMixedVersionTest: {};
  }
}

const ActivityMixedVersionTest: StaticActivityComponentType<"ActivityMixedVersionTest"> = () => {
  const { push } = useFlow();

  return (
    <AppScreen>
      <AppBar>
        <AppBarLeft>
          <AppBarBackButton />
        </AppBarLeft>
        <AppBarMain title="Mixed Version Test" />
        <AppBarRight>
          <AppBarIconButton aria-label="Home" onClick={() => push("ActivityHome", {})}>
            <IconHouseLine />
          </AppBarIconButton>
        </AppBarRight>
      </AppBar>
      <AppScreenContent>
        <VStack gap="x2">
          <div
            style={{
              background: "var(--seed-semantic-color-primary)",
              height: "32px",
            }}
          />
          <div
            style={{
              background: "var(--seed-semantic-color-paper-default)",
              height: "32px",
            }}
          />
          <div
            style={{
              background: "var(--seed-scale-color-blue-200)",
              height: "32px",
            }}
          />
          <Box bg="bg.brandSolid" height="32px" />
          <Box bg="bg.layerDefault" height="32px" />
          <Box bg="palette.blue200" height="32px" />
        </VStack>
      </AppScreenContent>
    </AppScreen>
  );
};

export default ActivityMixedVersionTest;
