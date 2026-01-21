import { VStack, Text } from "@seed-design/react";
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
import { appScreenVariantMap } from "@seed-design/css/recipes/app-screen";
import { Snackbar, useSnackbarAdapter } from "seed-design/ui/snackbar";
import { SegmentedControl, SegmentedControlItem } from "seed-design/ui/segmented-control";
import { useState } from "react";

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
  const { create } = useSnackbarAdapter();
  const [preventSwipeBack, setPreventSwipeBack] = useState(false);

  return (
    <AppScreen
      transitionStyle={transitionStyle}
      preventSwipeBack={preventSwipeBack}
      onSwipeBackStart={() => {
        create({ render: () => <Snackbar message="Started swiping" />, timeout: 500 });
      }}
      onSwipeBackEnd={({ swiped }) => {
        create({ render: () => <Snackbar message={`Swiped: ${swiped}`} />, timeout: 500 });
      }}
    >
      <AppBar>
        <AppBarLeft>
          <AppBarBackButton />
        </AppBarLeft>
        {/* can be undefined if search parameter isn't provided */}
        <AppBarMain title={transitionStyle ?? "Transition Styles"} />
        <AppBarRight>
          <AppBarIconButton aria-label="Home" onClick={() => push("ActivityHome", {})}>
            <IconHouseLine />
          </AppBarIconButton>
        </AppBarRight>
      </AppBar>
      <AppScreenContent>
        <VStack px="spacingX.globalGutter" py="x3" gap="x4">
          <VStack gap="x2">
            {appScreenVariantMap.transitionStyle.map((style) => (
              <ActionButton
                key={style}
                variant={transitionStyle === style ? "neutralWeak" : "neutralSolid"}
                onClick={() => push("ActivityTransitionStyle", { transitionStyle: style })}
              >
                {style}
              </ActionButton>
            ))}
          </VStack>
          <VStack gap="x2" align="center">
            <Text textStyle="t3Bold" aria-hidden>
              Prevent Swipe Back
            </Text>
            <SegmentedControl
              value={preventSwipeBack ? "true" : "false"}
              onValueChange={(value) => setPreventSwipeBack(value === "true")}
              aria-label="Prevent Swipe Back"
            >
              <SegmentedControlItem value="false">false</SegmentedControlItem>
              <SegmentedControlItem value="true">true</SegmentedControlItem>
            </SegmentedControl>
          </VStack>
        </VStack>
      </AppScreenContent>
    </AppScreen>
  );
};

export default ActivityTransitionStyle;
