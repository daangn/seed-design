import type { StaticActivityComponentType } from "@stackflow/react/future";

import { useFlow } from "@stackflow/react/future";
import {
  AppBar,
  AppBarLeft,
  AppBarMain,
  AppBarBackButton,
  AppBarIconButton,
  AppBarRight,
} from "seed-design/ui/app-bar";
import { AppScreen, AppScreenContent } from "seed-design/ui/app-screen";
import { IconHouseLine } from "@karrotmarket/react-monochrome-icon";
import { Badge, HStack, Text, VStack } from "@seed-design/react";

declare module "@stackflow/config" {
  interface Register {
    ActivityBadge: {};
  }
}

const ActivityBadge: StaticActivityComponentType<"ActivityBadge"> = () => {
  const { push } = useFlow();

  return (
    <AppScreen>
      <AppBar>
        <AppBarLeft>
          <AppBarBackButton />
        </AppBarLeft>
        <AppBarMain>Badge</AppBarMain>
        <AppBarRight>
          <AppBarIconButton aria-label="Home" onClick={() => push("ActivityHome", {})}>
            <IconHouseLine />
          </AppBarIconButton>
        </AppBarRight>
      </AppBar>
      <AppScreenContent>
        <VStack gap="x4" px="spacingX.globalGutter" py="x3" pb="safeArea">
          <Text textStyle="t1Bold">t1 Est eiusmod sit do minim sunt incididunt aliqua et sit.</Text>
          <HStack gap="x2" wrap>
            <VStack gap="x2">
              <Badge size="medium" variant="outline" tone="neutral">
                t1 Est eiusmod sit do minim sunt incididunt aliqua et sit.
              </Badge>
              <Badge size="medium" variant="outline" tone="brand">
                t1 Est eiusmod sit do minim sunt incididunt aliqua et sit.
              </Badge>
              <Badge size="medium" variant="outline" tone="critical">
                t1 Est eiusmod sit do minim sunt incididunt aliqua et sit.
              </Badge>
              <Badge size="medium" variant="outline" tone="informative">
                t1 Est eiusmod sit do minim sunt incididunt aliqua et sit.
              </Badge>
              <Badge size="medium" variant="outline" tone="positive">
                t1 Est eiusmod sit do minim sunt incididunt aliqua et sit.
              </Badge>
              <Badge size="medium" variant="outline" tone="warning">
                t1 Est eiusmod sit do minim sunt incididunt aliqua et sit.
              </Badge>
            </VStack>
            <VStack gap="x2">
              <Badge size="medium" variant="solid" tone="neutral">
                t1 Est eiusmod sit do minim sunt incididunt aliqua et sit.
              </Badge>
              <Badge size="medium" variant="solid" tone="brand">
                t1 Est eiusmod sit do minim sunt incididunt aliqua et sit.
              </Badge>
              <Badge size="medium" variant="solid" tone="critical">
                t1 Est eiusmod sit do minim sunt incididunt aliqua et sit.
              </Badge>
              <Badge size="medium" variant="solid" tone="informative">
                t1 Est eiusmod sit do minim sunt incididunt aliqua et sit.
              </Badge>
              <Badge size="medium" variant="solid" tone="positive">
                t1 Est eiusmod sit do minim sunt incididunt aliqua et sit.
              </Badge>
              <Badge size="medium" variant="solid" tone="warning">
                t1 Est eiusmod sit do minim sunt incididunt aliqua et sit.
              </Badge>
            </VStack>
            <VStack gap="x2">
              <Badge size="medium" variant="weak" tone="neutral">
                t1 Est eiusmod sit do minim sunt incididunt aliqua et sit.
              </Badge>
              <Badge size="medium" variant="weak" tone="brand">
                t1 Est eiusmod sit do minim sunt incididunt aliqua et sit.
              </Badge>
              <Badge size="medium" variant="weak" tone="critical">
                t1 Est eiusmod sit do minim sunt incididunt aliqua et sit.
              </Badge>
              <Badge size="medium" variant="weak" tone="informative">
                t1 Est eiusmod sit do minim sunt incididunt aliqua et sit.
              </Badge>
              <Badge size="medium" variant="weak" tone="positive">
                t1 Est eiusmod sit do minim sunt incididunt aliqua et sit.
              </Badge>
              <Badge size="medium" variant="weak" tone="warning">
                t1 Est eiusmod sit do minim sunt incididunt aliqua et sit.
              </Badge>
            </VStack>
          </HStack>
          <Text textStyle="t2Bold">t2 Est eiusmod sit do minim sunt incididunt aliqua et sit.</Text>
          <HStack gap="x2" wrap>
            <VStack gap="x2">
              <Badge size="large" variant="outline" tone="neutral">
                t2 Est eiusmod sit do minim sunt incididunt aliqua et sit.
              </Badge>
              <Badge size="large" variant="outline" tone="brand">
                t2 Est eiusmod sit do minim sunt incididunt aliqua et sit.
              </Badge>
              <Badge size="large" variant="outline" tone="critical">
                t2 Est eiusmod sit do minim sunt incididunt aliqua et sit.
              </Badge>
              <Badge size="large" variant="outline" tone="informative">
                t2 Est eiusmod sit do minim sunt incididunt aliqua et sit.
              </Badge>
              <Badge size="large" variant="outline" tone="positive">
                t2 Est eiusmod sit do minim sunt incididunt aliqua et sit.
              </Badge>
              <Badge size="large" variant="outline" tone="warning">
                t2 Est eiusmod sit do minim sunt incididunt aliqua et sit.
              </Badge>
            </VStack>
            <VStack gap="x2">
              <Badge size="large" variant="solid" tone="neutral">
                t2 Est eiusmod sit do minim sunt incididunt aliqua et sit.
              </Badge>
              <Badge size="large" variant="solid" tone="brand">
                t2 Est eiusmod sit do minim sunt incididunt aliqua et sit.
              </Badge>
              <Badge size="large" variant="solid" tone="critical">
                t2 Est eiusmod sit do minim sunt incididunt aliqua et sit.
              </Badge>
              <Badge size="large" variant="solid" tone="informative">
                t2 Est eiusmod sit do minim sunt incididunt aliqua et sit.
              </Badge>
              <Badge size="large" variant="solid" tone="positive">
                t2 Est eiusmod sit do minim sunt incididunt aliqua et sit.
              </Badge>
              <Badge size="large" variant="solid" tone="warning">
                t2 Est eiusmod sit do minim sunt incididunt aliqua et sit.
              </Badge>
            </VStack>
            <VStack gap="x2">
              <Badge size="large" variant="weak" tone="neutral">
                t2 Est eiusmod sit do minim sunt incididunt aliqua et sit.
              </Badge>
              <Badge size="large" variant="weak" tone="brand">
                t2 Est eiusmod sit do minim sunt incididunt aliqua et sit.
              </Badge>
              <Badge size="large" variant="weak" tone="critical">
                t2 Est eiusmod sit do minim sunt incididunt aliqua et sit.
              </Badge>
              <Badge size="large" variant="weak" tone="informative">
                t2 Est eiusmod sit do minim sunt incididunt aliqua et sit.
              </Badge>
              <Badge size="large" variant="weak" tone="positive">
                t2 Est eiusmod sit do minim sunt incididunt aliqua et sit.
              </Badge>
              <Badge size="large" variant="weak" tone="warning">
                t2 Est eiusmod sit do minim sunt incididunt aliqua et sit.
              </Badge>
            </VStack>
          </HStack>
        </VStack>
      </AppScreenContent>
    </AppScreen>
  );
};

export default ActivityBadge;
