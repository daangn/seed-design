import { IconChevronLeftLine, IconXmarkLine } from "@karrotmarket/react-monochrome-icon";
import { basicRendererPlugin } from "@stackflow/plugin-renderer-basic";
import { Box, HStack, VStack } from "@seed-design/react";
import { seedPlugin } from "@seed-design/stackflow";
import { stackflow } from "@stackflow/react";
import {
  AppBar,
  AppBarIconButton,
  AppBarLeft,
  AppBarMain,
  AppBarRight,
} from "seed-design/ui/app-bar";
import { AppScreen } from "seed-design/ui/app-screen";
import type { ReactNode } from "react";

function CupertinoActivity() {
  return (
    <AppScreen theme="cupertino">
      <AppBar theme="cupertino">
        <AppBarLeft>
          <AppBarIconButton aria-label="뒤로">
            <IconChevronLeftLine />
          </AppBarIconButton>
        </AppBarLeft>
        <AppBarMain title="화면 제목" subtitle="보조 제목" />
        <AppBarRight>
          <AppBarIconButton aria-label="닫기">
            <IconXmarkLine />
          </AppBarIconButton>
        </AppBarRight>
      </AppBar>
    </AppScreen>
  );
}

function AndroidActivity() {
  return (
    <AppScreen theme="android">
      <AppBar theme="android">
        <AppBarLeft>
          <AppBarIconButton aria-label="뒤로">
            <IconChevronLeftLine />
          </AppBarIconButton>
        </AppBarLeft>
        <AppBarMain title="화면 제목" subtitle="보조 제목" />
        <AppBarRight>
          <AppBarIconButton aria-label="닫기">
            <IconXmarkLine />
          </AppBarIconButton>
        </AppBarRight>
      </AppBar>
    </AppScreen>
  );
}

const { Stack: CupertinoStack } = stackflow({
  activities: { CupertinoActivity },
  initialActivity: () => "CupertinoActivity",
  plugins: [basicRendererPlugin(), seedPlugin({ theme: "cupertino" })],
  transitionDuration: 0,
});

const { Stack: AndroidStack } = stackflow({
  activities: { AndroidActivity },
  initialActivity: () => "AndroidActivity",
  plugins: [basicRendererPlugin(), seedPlugin({ theme: "android" })],
  transitionDuration: 0,
});

function ExampleFrame({ children }: { children: ReactNode }) {
  return (
    <Box
      position="relative"
      width="375px"
      maxWidth="100%"
      height="375px"
      overflowX="hidden"
      overflowY="hidden"
      borderWidth={1}
      borderColor="stroke.neutralWeak"
      borderRadius="r4"
    >
      {children}
    </Box>
  );
}

export default function PlatformLayouts() {
  return (
    <HStack gap="x6" flexWrap="wrap" justify="center">
      <VStack gap="x3">
        <span>Cupertino</span>
        <ExampleFrame>
          <CupertinoStack />
        </ExampleFrame>
      </VStack>
      <VStack gap="x3">
        <span>Android</span>
        <ExampleFrame>
          <AndroidStack />
        </ExampleFrame>
      </VStack>
    </HStack>
  );
}
