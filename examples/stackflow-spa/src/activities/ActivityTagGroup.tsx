import {
  IconHouseLine,
  IconLocationpinFill,
  IconMegaphoneFill,
} from "@karrotmarket/react-monochrome-icon";
import { Text, VStack } from "@seed-design/react";
import type { StaticActivityComponentType } from "@stackflow/react/future";
import { useFlow } from "@stackflow/react/future";
import {
  AppBar,
  AppBarBackButton,
  AppBarIconButton,
  AppBarLeft,
  AppBarMain,
  AppBarRight,
} from "seed-design/ui/app-bar";
import { AppScreen, AppScreenContent } from "seed-design/ui/app-screen";
import { TagGroupItem, TagGroupRoot } from "seed-design/ui/tag-group";

declare module "@stackflow/config" {
  interface Register {
    ActivityTagGroup: {};
  }
}

const SIZES = ["t2", "t3", "t4"] as const;

const ActivityTagGroup: StaticActivityComponentType<"ActivityTagGroup"> = () => {
  const { push } = useFlow();

  return (
    <AppScreen layerOffsetBottom="safeArea">
      <AppBar>
        <AppBarLeft>
          <AppBarBackButton />
        </AppBarLeft>
        <AppBarMain>Tag Group</AppBarMain>
        <AppBarRight>
          <AppBarIconButton aria-label="Home" onClick={() => push("ActivityHome", {})}>
            <IconHouseLine />
          </AppBarIconButton>
        </AppBarRight>
      </AppBar>
      <AppScreenContent>
        <VStack gap="x6" px="spacingX.globalGutter" py="x4">
          {SIZES.map((size) => (
            <VStack key={size} gap="x3">
              <Text textStyle="t4Bold">{size}</Text>
              <VStack gap="x1">
                <Text textStyle="t2Medium" color="fg.neutralMuted">
                  Default
                </Text>
                <TagGroupRoot size={size} tone="neutralSubtle">
                  <TagGroupItem label="광고" suffixIcon={<IconMegaphoneFill />} />
                  <TagGroupItem label="끌올 3시간 전" />
                  <TagGroupItem label="서초4동" prefixIcon={<IconLocationpinFill />} />
                </TagGroupRoot>
              </VStack>
              <VStack gap="x1" style={{ maxWidth: 220 }}>
                <Text textStyle="t2Medium" color="fg.neutralMuted">
                  Truncate
                </Text>
                <TagGroupRoot size={size} tone="neutralSubtle" truncate>
                  <TagGroupItem label="광고" suffixIcon={<IconMegaphoneFill />} />
                  <TagGroupItem label="끌올 3시간 전" />
                  <TagGroupItem label="서초4동" prefixIcon={<IconLocationpinFill />} />
                </TagGroupRoot>
              </VStack>
            </VStack>
          ))}
        </VStack>
      </AppScreenContent>
    </AppScreen>
  );
};

export default ActivityTagGroup;
