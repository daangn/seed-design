"use client";

import { IconChevronLeftLine, IconXmarkLine } from "@karrotmarket/react-monochrome-icon";
import { basicRendererPlugin } from "@stackflow/plugin-renderer-basic";
import { Box, Flex } from "@seed-design/react";
import { seedPlugin } from "@seed-design/stackflow";
import { stackflow } from "@stackflow/react";
import {
  AppBar,
  AppBarIconButton,
  AppBarLeft,
  AppBarMain,
  AppBarRight,
  AppBarSlot,
} from "seed-design/ui/app-bar";
import { AppScreen, AppScreenContent } from "seed-design/ui/app-screen";
import { useState } from "react";

function Activity() {
  const [lastAction, setLastAction] = useState("없음");

  return (
    <AppScreen theme="cupertino">
      <AppBar>
        <AppBarLeft>
          <AppBarIconButton aria-label="뒤로" onClick={() => setLastAction("뒤로")}>
            <IconChevronLeftLine />
          </AppBarIconButton>
        </AppBarLeft>
        <AppBarMain title="작성하기" />
        <AppBarRight>
          <AppBarSlot>
            <button type="button">완료</button>
          </AppBarSlot>
          <AppBarIconButton aria-label="닫기" onClick={() => setLastAction("닫기")}>
            <IconXmarkLine />
          </AppBarIconButton>
        </AppBarRight>
      </AppBar>
      <AppScreenContent>
        <Flex height="full" align="center" justify="center" color="fg.neutralMuted">
          마지막 액션: {lastAction}
        </Flex>
      </AppScreenContent>
    </AppScreen>
  );
}

const { Stack } = stackflow({
  activities: { Activity },
  initialActivity: () => "Activity",
  plugins: [basicRendererPlugin(), seedPlugin({ theme: "cupertino" })],
  transitionDuration: 0,
});

export default function LeftAndRightActions() {
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
      <Stack />
    </Box>
  );
}
