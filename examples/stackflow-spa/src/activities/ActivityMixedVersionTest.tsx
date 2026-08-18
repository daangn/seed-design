import { Box, VStack } from "@seed-design/react";
import type { StaticActivityComponentType } from "@stackflow/react/future";
import { useFlow } from "@stackflow/react/future";
import { IconHouseLine } from "@karrotmarket/react-monochrome-icon";
import {
  NextAppBar,
  NextAppBarBackButton,
  NextAppBarIconButton,
  NextAppBarLeft,
  NextAppBarMain,
  NextAppBarRight,
} from "seed-design/ui/next-app-bar";
import { NextAppScreen, NextAppScreenContent } from "seed-design/ui/next-app-screen";

declare module "@stackflow/config" {
  interface Register {
    ActivityMixedVersionTest: {};
  }
}

const ActivityMixedVersionTest: StaticActivityComponentType<"ActivityMixedVersionTest"> = () => {
  const { push } = useFlow();

  return (
    <NextAppScreen>
      <NextAppBar>
        <NextAppBarLeft>
          <NextAppBarBackButton />
        </NextAppBarLeft>
        <NextAppBarMain title="Mixed Version Test" />
        <NextAppBarRight>
          <NextAppBarIconButton aria-label="Home" onClick={() => push("ActivityHome", {})}>
            <IconHouseLine />
          </NextAppBarIconButton>
        </NextAppBarRight>
      </NextAppBar>
      <NextAppScreenContent>
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
      </NextAppScreenContent>
    </NextAppScreen>
  );
};

export default ActivityMixedVersionTest;
