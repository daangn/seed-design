import { VStack } from "@seed-design/react";
import { useFlow, type StaticActivityComponentType } from "@stackflow/react/future";
import {
  NextAppBar,
  NextAppBarBackButton,
  NextAppBarLeft,
  NextAppBarMain,
  NextAppBarIconButton,
  NextAppBarRight,
} from "seed-design/ui/next-app-bar";
import { NextAppScreen, NextAppScreenContent } from "seed-design/ui/next-app-screen";
import { ActionButton } from "seed-design/ui/action-button";
import { IconHouseLine } from "@karrotmarket/react-monochrome-icon";

declare module "@stackflow/config" {
  interface Register {
    ActivityBottomSheetActivity: {};
  }
}

const ActivityBottomSheetActivity: StaticActivityComponentType<
  "ActivityBottomSheetActivity"
> = () => {
  const { push } = useFlow();

  return (
    <NextAppScreen>
      <NextAppBar>
        <NextAppBarLeft>
          <NextAppBarBackButton />
        </NextAppBarLeft>
        <NextAppBarMain title="Activity" />
        <NextAppBarRight>
          <NextAppBarIconButton aria-label="Home" onClick={() => push("ActivityHome", {})}>
            <IconHouseLine />
          </NextAppBarIconButton>
        </NextAppBarRight>
      </NextAppBar>
      <NextAppScreenContent>
        <VStack p="x5" justify="center" gap="x4">
          <ActionButton
            variant="neutralSolid"
            flexGrow
            onClick={() => push("ActivityBottomSheet", {})}
          >
            ActivityBottomSheet을 Push
          </ActionButton>
          <ActionButton
            variant="neutralWeak"
            flexGrow
            onClick={() => push("ActivityBottomSheetActivity", {})}
          >
            지금 열린 이 Activity를 Push
          </ActionButton>
        </VStack>
      </NextAppScreenContent>
    </NextAppScreen>
  );
};

export default ActivityBottomSheetActivity;
