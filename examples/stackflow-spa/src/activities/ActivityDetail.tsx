import { Text, VStack } from "@seed-design/react";
import { useFlow, type StaticActivityComponentType } from "@stackflow/react/future";
import {
  NextAppBar,
  NextAppBarBackButton,
  NextAppBarIconButton,
  NextAppBarLeft,
  NextAppBarMain,
  NextAppBarRight,
} from "seed-design/ui/next-app-bar";
import {
  NextAppScreen,
  NextAppScreenContent,
  type NextAppScreenProps,
} from "seed-design/ui/next-app-screen";
import { IconHouseLine } from "@karrotmarket/react-monochrome-icon";
import { nextAppScreenVariantMap } from "@seed-design/css/recipes/next-app-screen";
import { ActionButton } from "seed-design/ui/action-button";

declare module "@stackflow/config" {
  interface Register {
    ActivityDetail: {
      title: string;
      body: string;
      transitionStyle?: NonNullable<NextAppScreenProps["transitionStyle"]>;
    };
  }
}

const ActivityDetail: StaticActivityComponentType<"ActivityDetail"> = ({ params }) => {
  const { push } = useFlow();

  return (
    <NextAppScreen transitionStyle={params.transitionStyle}>
      <NextAppBar>
        <NextAppBarLeft>
          <NextAppBarBackButton />
        </NextAppBarLeft>
        <NextAppBarMain title={params.title} />
        <NextAppBarRight>
          <NextAppBarIconButton aria-label="Home" onClick={() => push("ActivityHome", {})}>
            <IconHouseLine />
          </NextAppBarIconButton>
        </NextAppBarRight>
      </NextAppBar>
      <NextAppScreenContent>
        <VStack gap="x4">
          <VStack px="spacingX.globalGutter" py="x3" gap="x2">
            <Text textStyle="articleBody">{params.body}</Text>
            {params.transitionStyle && (
              <Text textStyle="articleBody">transitionStyle: {params.transitionStyle}</Text>
            )}
          </VStack>
          <VStack px="spacingX.globalGutter" py="x3" gap="x2">
            {nextAppScreenVariantMap.transitionStyle.map((style) => (
              <ActionButton
                key={style}
                variant={params.transitionStyle === style ? "neutralWeak" : "neutralSolid"}
                onClick={() =>
                  push("ActivityDetail", {
                    title: params.title,
                    body: params.body,
                    transitionStyle: style,
                  })
                }
              >
                transitionStyle: {style}
              </ActionButton>
            ))}
          </VStack>
        </VStack>
      </NextAppScreenContent>
    </NextAppScreen>
  );
};

export default ActivityDetail;
