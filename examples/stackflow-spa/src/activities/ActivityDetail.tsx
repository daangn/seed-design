import { Text, VStack } from "@seed-design/react";
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
import { appScreenVariantMap } from "@seed-design/css/recipes/app-screen";
import { ActionButton } from "seed-design/ui/action-button";

declare module "@stackflow/config" {
  interface Register {
    ActivityDetail: {
      title: string;
      body: string;
      transitionStyle?: NonNullable<AppScreenProps["transitionStyle"]>;
    };
  }
}

const ActivityDetail: StaticActivityComponentType<"ActivityDetail"> = ({ params }) => {
  const { push } = useFlow();

  return (
    <AppScreen transitionStyle={params.transitionStyle}>
      <AppBar>
        <AppBarLeft>
          <AppBarBackButton />
        </AppBarLeft>
        <AppBarMain title={params.title} />
        <AppBarRight>
          <AppBarIconButton aria-label="Home" onClick={() => push("ActivityHome", {})}>
            <IconHouseLine />
          </AppBarIconButton>
        </AppBarRight>
      </AppBar>
      <AppScreenContent>
        <VStack gap="x4">
          <VStack px="spacingX.globalGutter" py="x3" gap="x2">
            <Text textStyle="articleBody">{params.body}</Text>
            {params.transitionStyle && (
              <Text textStyle="articleBody">transitionStyle: {params.transitionStyle}</Text>
            )}
          </VStack>
          <VStack px="spacingX.globalGutter" py="x3" gap="x2">
            {appScreenVariantMap.transitionStyle.map((style) => (
              <ActionButton
                key={style}
                variant={params.transitionStyle === style ? "neutralWeak" : "neutralSolid"}
                onClick={() => push("ActivityTransitionStyle", { transitionStyle: style })}
              >
                transitionStyle: {style}
              </ActionButton>
            ))}
          </VStack>
        </VStack>
      </AppScreenContent>
    </AppScreen>
  );
};

export default ActivityDetail;
