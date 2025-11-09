import { Box } from "@seed-design/react";
import { useActivity, type ActivityComponentType } from "@stackflow/react/future";
import { AppBar, AppBarBackButton, AppBarLeft, AppBarMain } from "seed-design/ui/app-bar";
import { AppScreen, AppScreenContent } from "seed-design/ui/app-screen";
import { useTheme } from "../contexts/ThemeContext";

declare module "@stackflow/config" {
  interface Register {
    ActivityBottomSheetDetail: {
      title: string;
    };
  }
}

const ActivityBottomSheetDetail: ActivityComponentType<"ActivityBottomSheetDetail"> = () => {
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
        <Box px="spacingX.globalGutter" py="spacingY.xl">
          BottomSheet에서 선택한 "{params.title}"의 상세 페이지입니다.
        </Box>
      </AppScreenContent>
    </AppScreen>
  );
};

export default ActivityBottomSheetDetail;
