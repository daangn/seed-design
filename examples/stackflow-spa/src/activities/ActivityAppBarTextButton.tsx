import { useState } from "react";
import { Flex, Text } from "@seed-design/react";
import type { StaticActivityComponentType } from "@stackflow/react/future";
import {
  AppBar,
  AppBarLeft,
  AppBarMain,
  AppBarRight,
  AppBarTextButton,
} from "seed-design/ui/app-bar";
import { AppScreen, AppScreenContent } from "seed-design/ui/app-screen";

declare module "@stackflow/config" {
  interface Register {
    ActivityAppBarTextButton: {};
  }
}

const ActivityAppBarTextButton: StaticActivityComponentType<"ActivityAppBarTextButton"> = () => {
  const [lastAction, setLastAction] = useState("없음");

  return (
    <AppScreen>
      <AppBar>
        <AppBarLeft>
          <AppBarTextButton onClick={() => setLastAction("취소")}>취소</AppBarTextButton>
        </AppBarLeft>
        <AppBarMain title="작성하기" />
        <AppBarRight>
          <AppBarTextButton onClick={() => setLastAction("완료")}>완료</AppBarTextButton>
        </AppBarRight>
      </AppBar>
      <AppScreenContent>
        <Flex justify="center" align="center" height="full">
          <Text color="fg.neutralMuted">마지막 액션: {lastAction}</Text>
        </Flex>
      </AppScreenContent>
    </AppScreen>
  );
};

export default ActivityAppBarTextButton;
