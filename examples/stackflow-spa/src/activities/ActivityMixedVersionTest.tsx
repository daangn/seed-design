import { Box, VStack } from "@seed-design/react";
import type { ActivityComponentType } from "@stackflow/react";
import { AppBar, AppBarBackButton, AppBarLeft, AppBarMain } from "../seed-design/stackflow/AppBar";
import { AppScreen, AppScreenContent } from "../seed-design/stackflow/AppScreen";

const ActivityMixedVersionTest: ActivityComponentType = () => {
  return (
    <AppScreen>
      <AppBar>
        <AppBarLeft>
          <AppBarBackButton />
        </AppBarLeft>
        <AppBarMain title="Mixed Version Test" />
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
