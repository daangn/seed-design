import { useFlow, type StaticActivityComponentType } from "@stackflow/react/future";
import {
  AppBar,
  AppBarLeft,
  AppBarRight,
  AppBarMain,
  AppBarBackButton,
  AppBarIconButton,
} from "seed-design/ui/app-bar";
import { AppScreen, AppScreenContent } from "seed-design/ui/app-screen";

import {
  IconBellLine,
  IconChevronLeftLine,
  IconHouseLine,
} from "@karrotmarket/react-monochrome-icon";
import { ActionButton } from "seed-design/ui/action-button";
import { HStack, PrefixIcon, VStack } from "@seed-design/react";
import { useState } from "react";

declare module "@stackflow/config" {
  interface Register {
    ActivityLayerBar: {};
  }
}

const ActivityLayerBar: StaticActivityComponentType<"ActivityLayerBar"> = () => {
  const { push, pop } = useFlow();

  const [counts, setCounts] = useState({ left: 1, right: 1 });

  return (
    <AppScreen>
      <AppBar divider>
        <AppBarLeft>
          {Array.from({ length: counts.left }).map((_, index) => (
            <AppBarIconButton key={index}>
              <IconBellLine />
            </AppBarIconButton>
          ))}
        </AppBarLeft>
        <AppBarMain
          title="Random Long Title Hello World Commodo occaecat laboris voluptate aute magna."
          subtitle="Subtitle Ut voluptate in sint sunt adipisicing ex adipisicing magna ad fugiat excepteur commodo voluptate."
        />
        <AppBarRight>
          {Array.from({ length: counts.right }).map((_, index) => (
            <AppBarIconButton key={index}>
              <IconBellLine />
            </AppBarIconButton>
          ))}
        </AppBarRight>
      </AppBar>
      <AppScreenContent>
        <VStack gap="spacingY.componentDefault" px="spacingX.globalGutter" py="x3">
          <ActionButton variant="neutralSolid" onClick={() => push("ActivityTransparentBar", {})}>
            ActivityTransparentBar
          </ActionButton>
          <ActionButton variant="neutralWeak" onClick={() => pop()}>
            <PrefixIcon svg={<IconChevronLeftLine />} /> Back
          </ActionButton>
          <ActionButton variant="neutralWeak" onClick={() => push("ActivityHome", {})}>
            <PrefixIcon svg={<IconHouseLine />} />
            ActivityHome
          </ActionButton>
          <HStack gap="x2">
            <ActionButton
              variant="neutralWeak"
              flexGrow
              onClick={() => setCounts((prev) => ({ ...prev, left: prev.left + 1 }))}
            >
              Append Left
            </ActionButton>
            <ActionButton
              variant="neutralWeak"
              flexGrow
              onClick={() => setCounts((prev) => ({ ...prev, right: prev.right + 1 }))}
            >
              Append Right
            </ActionButton>
          </HStack>
          <HStack gap="x2">
            <ActionButton
              variant="neutralWeak"
              flexGrow
              onClick={() =>
                setCounts((prev) => ({
                  ...prev,
                  left: Math.max(0, prev.left - 1),
                }))
              }
            >
              Remove Left
            </ActionButton>
            <ActionButton
              variant="neutralWeak"
              flexGrow
              onClick={() =>
                setCounts((prev) => ({
                  ...prev,
                  right: Math.max(0, prev.right - 1),
                }))
              }
            >
              Remove Right
            </ActionButton>
          </HStack>
        </VStack>
      </AppScreenContent>
    </AppScreen>
  );
};

export default ActivityLayerBar;
