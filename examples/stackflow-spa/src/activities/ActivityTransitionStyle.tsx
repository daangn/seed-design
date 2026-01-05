import { VStack } from "@seed-design/react";
import { useFlow, type StaticActivityComponentType } from "@stackflow/react/future";
import {
  AppBar,
  AppBarBackButton,
  AppBarIconButton,
  AppBarLeft,
  AppBarMain,
  AppBarRight,
} from "seed-design/ui/app-bar";
import { AppScreen, AppScreenContent, type AppScreenProps } from "seed-design/ui/app-screen";
import { IconHouseLine } from "@karrotmarket/react-monochrome-icon";
import { ActionButton } from "seed-design/ui/action-button";

declare module "@stackflow/config" {
  interface Register {
    ActivityTransitionStyle: {
      transitionStyle: NonNullable<AppScreenProps["transitionStyle"]>;
    };
  }
}

const ActivityTransitionStyle: StaticActivityComponentType<"ActivityTransitionStyle"> = ({
  params: { transitionStyle },
}) => {
  const { push } = useFlow();

  return (
    <AppScreen transitionStyle={transitionStyle}>
      <AppBar>
        <AppBarLeft>
          <AppBarBackButton />
        </AppBarLeft>
        <AppBarMain title={transitionStyle} />
        <AppBarRight>
          <AppBarIconButton aria-label="Home" onClick={() => push("ActivityHome", {})}>
            <IconHouseLine />
          </AppBarIconButton>
        </AppBarRight>
      </AppBar>
      <AppScreenContent>
        <VStack px="spacingX.globalGutter" py="x3" gap="x2">
          <ActionButton
            variant={transitionStyle === "slideFromRightIOS" ? "neutralWeak" : "neutralSolid"}
            onClick={() =>
              push("ActivityTransitionStyle", { transitionStyle: "slideFromRightIOS" })
            }
          >
            slideFromRightIOS
          </ActionButton>
          <ActionButton
            variant={transitionStyle === "fadeFromBottomAndroid" ? "neutralWeak" : "neutralSolid"}
            onClick={() =>
              push("ActivityTransitionStyle", { transitionStyle: "fadeFromBottomAndroid" })
            }
          >
            fadeFromBottomAndroid
          </ActionButton>
        </VStack>
      </AppScreenContent>
    </AppScreen>
  );
};

export default ActivityTransitionStyle;
