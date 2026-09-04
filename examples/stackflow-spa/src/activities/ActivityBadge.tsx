import type { StaticActivityComponentType } from "@stackflow/react/future";

import { useFlow } from "@stackflow/react/future";
import {
  NextAppBar,
  NextAppBarLeft,
  NextAppBarMain,
  NextAppBarBackButton,
  NextAppBarIconButton,
  NextAppBarRight,
} from "seed-design/ui/next-app-bar";
import { NextAppScreen, NextAppScreenContent } from "seed-design/ui/next-app-screen";
import { IconHouseLine } from "@karrotmarket/react-monochrome-icon";
import { Badge, HStack, Text, VStack } from "@seed-design/react";
import { badgeVariantMap } from "@seed-design/css/recipes/badge";

declare module "@stackflow/config" {
  interface Register {
    ActivityBadge: {};
  }
}

const ActivityBadge: StaticActivityComponentType<"ActivityBadge"> = () => {
  const { push } = useFlow();

  return (
    <NextAppScreen>
      <NextAppBar>
        <NextAppBarLeft>
          <NextAppBarBackButton />
        </NextAppBarLeft>
        <NextAppBarMain>Badge</NextAppBarMain>
        <NextAppBarRight>
          <NextAppBarIconButton aria-label="Home" onClick={() => push("ActivityHome", {})}>
            <IconHouseLine />
          </NextAppBarIconButton>
        </NextAppBarRight>
      </NextAppBar>
      <NextAppScreenContent>
        <VStack gap="x4" px="spacingX.globalGutter" py="x3" pb="safeArea">
          <Text textStyle="t1Bold">t1 Est eiusmod sit do minim sunt incididunt aliqua et sit.</Text>
          <HStack gap="x2" wrap>
            {badgeVariantMap.variant.map((variant) => (
              <VStack key={variant} gap="x2">
                {badgeVariantMap.tone.map((tone) => (
                  <Badge key={tone} size="medium" variant={variant} tone={tone}>
                    t1 Est eiusmod sit do minim sunt incididunt aliqua et sit.
                  </Badge>
                ))}
              </VStack>
            ))}
          </HStack>
          <Text textStyle="t2Bold">t2 Est eiusmod sit do minim sunt incididunt aliqua et sit.</Text>
          <HStack gap="x2" wrap>
            {badgeVariantMap.variant.map((variant) => (
              <VStack key={variant} gap="x2">
                {badgeVariantMap.tone.map((tone) => (
                  <Badge key={tone} size="large" variant={variant} tone={tone}>
                    t2 Est eiusmod sit do minim sunt incididunt aliqua et sit.
                  </Badge>
                ))}
              </VStack>
            ))}
          </HStack>
        </VStack>
      </NextAppScreenContent>
    </NextAppScreen>
  );
};

export default ActivityBadge;
