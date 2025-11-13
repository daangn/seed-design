import { VStack } from "@seed-design/react";
import { useFlow, type ActivityComponentType } from "@stackflow/react/future";
import { AppBar, AppBarBackButton, AppBarLeft, AppBarMain } from "seed-design/ui/app-bar";
import { AppScreen, AppScreenContent } from "seed-design/ui/app-screen";
import { ActionButton } from "seed-design/ui/action-button";

declare module "@stackflow/config" {
  interface Register {
    ActivityMenuSheetActivity: {};
  }
}

const ActivityMenuSheetActivity: ActivityComponentType<"ActivityMenuSheetActivity"> = () => {
  const { push } = useFlow();

  return (
    <AppScreen>
      <AppBar>
        <AppBarLeft>
          <AppBarBackButton />
        </AppBarLeft>
        <AppBarMain title="Activity" />
      </AppBar>
      <AppScreenContent>
        <VStack p="x5" justify="center" gap="x4">
          <ActionButton
            variant="neutralSolid"
            flexGrow
            onClick={() => push("ActivityMenuSheetSimple", {})}
          >
            ActivityMenuSheetSimple을 Push
          </ActionButton>
          <ActionButton
            variant="neutralWeak"
            flexGrow
            onClick={() => push("ActivityMenuSheetActivity", {})}
          >
            지금 열린 이 Activity를 Push
          </ActionButton>
        </VStack>
      </AppScreenContent>
    </AppScreen>
  );
};

export default ActivityMenuSheetActivity;
