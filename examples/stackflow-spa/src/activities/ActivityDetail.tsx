import { Box, Text } from "@seed-design/react";
import { useActivity, type ActivityComponentType } from "@stackflow/react/future";
import { AppBar, AppBarBackButton, AppBarLeft, AppBarMain } from "seed-design/ui/app-bar";
import { AppScreen, AppScreenContent } from "seed-design/ui/app-screen";
import { useTheme } from "../contexts/ThemeContext";

declare module "@stackflow/config" {
  interface Register {
    ActivityDetail: {
      title: string;
      body: string;
    };
  }
}

const ActivityDetail: ActivityComponentType<"ActivityDetail"> = () => {
  const { params } = useActivity();

  return (
    <AppScreen theme={useTheme().theme}>
      <AppBar>
        <AppBarLeft>
          <AppBarBackButton />
        </AppBarLeft>
        <AppBarMain title={params.title} />
      </AppBar>
      <AppScreenContent>
        <Box px="spacingX.globalGutter" py="x3">
          <Text textStyle="articleBody">{params.body}</Text>
        </Box>
      </AppScreenContent>
    </AppScreen>
  );
};

export default ActivityDetail;
