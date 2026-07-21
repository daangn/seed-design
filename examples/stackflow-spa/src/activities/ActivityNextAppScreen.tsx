import { Text, VStack } from "@seed-design/react";
import { nextAppScreenVariantMap } from "@seed-design/css/recipes/next-app-screen";
import { useFlow, type StaticActivityComponentType } from "@stackflow/react/future";
import { ActionButton } from "seed-design/ui/action-button";
import {
  NextAppBar,
  NextAppBarBackButton,
  NextAppBarLeft,
  NextAppBarMain,
} from "seed-design/ui/next-app-bar";
import {
  NextAppScreen,
  NextAppScreenContent,
  type NextAppScreenProps,
} from "seed-design/ui/next-app-screen";

declare module "@stackflow/config" {
  interface Register {
    ActivityNextAppScreen: {
      transitionStyle?: NonNullable<NextAppScreenProps["transitionStyle"]>;
      swipeBackArea?: NonNullable<NextAppScreenProps["swipeBackArea"]>;
    };
  }
}

const ActivityNextAppScreen: StaticActivityComponentType<"ActivityNextAppScreen"> = ({
  params,
}) => {
  const { push } = useFlow();

  return (
    <NextAppScreen transitionStyle={params.transitionStyle} swipeBackArea={params.swipeBackArea}>
      <NextAppBar>
        <NextAppBarLeft>
          <NextAppBarBackButton />
        </NextAppBarLeft>
        <NextAppBarMain title="NextAppScreen" />
      </NextAppBar>
      <NextAppScreenContent>
        <VStack px="spacingX.globalGutter" py="x3" gap="x2">
          {params.transitionStyle && (
            <Text textStyle="articleBody">transitionStyle: {params.transitionStyle}</Text>
          )}
          {params.swipeBackArea && (
            <Text textStyle="articleBody">swipeBackArea: {params.swipeBackArea}</Text>
          )}
          {nextAppScreenVariantMap.transitionStyle.map((style) => (
            <ActionButton
              key={style}
              variant={params.transitionStyle === style ? "neutralWeak" : "neutralSolid"}
              onClick={() => push("ActivityNextAppScreen", { transitionStyle: style })}
            >
              push transitionStyle: {style}
            </ActionButton>
          ))}
          <ActionButton
            variant="brandSolid"
            onClick={() => push("ActivityNextAppScreen", { swipeBackArea: "full" })}
          >
            push swipeBackArea: full
          </ActionButton>
          <ActionButton onClick={() => push("ActivityNextAppScreenTransparent", {})}>
            push transparent tone
          </ActionButton>
        </VStack>
      </NextAppScreenContent>
    </NextAppScreen>
  );
};

export default ActivityNextAppScreen;
