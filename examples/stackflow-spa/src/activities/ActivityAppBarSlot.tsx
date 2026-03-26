import { useActivity, useFlow, type StaticActivityComponentType } from "@stackflow/react/future";
import {
  AppBar,
  AppBarBackButton,
  AppBarLeft,
  AppBarRight,
  AppBarIconButton,
  AppBarSlot,
} from "seed-design/ui/app-bar";
import { AppScreen, AppScreenContent } from "seed-design/ui/app-screen";
import { IconBellLine } from "@karrotmarket/react-monochrome-icon";
import { Flex, Text, VStack } from "@seed-design/react";
import { ActionButton } from "seed-design/ui/action-button";

declare module "@stackflow/config" {
  interface Register {
    ActivityAppBarSlot: Record<string, never>;
  }
}

function FakeSearchBar(props: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <Flex grow py="x2" px="x2_5" height="full" style={{ boxSizing: "border-box" }} {...props}>
      <Flex
        px="x3"
        background="bg.neutralWeak"
        grow
        borderRadius="r2"
        align="center"
        borderColor="stroke.neutralMuted"
        borderWidth={1}
      >
        <Text color="fg.placeholder" textStyle="t4Medium">
          검색어를 입력하세요
        </Text>
      </Flex>
    </Flex>
  );
}

const ActivityAppBarSlot: StaticActivityComponentType<"ActivityAppBarSlot"> = () => {
  const { isRoot } = useActivity();
  const { push } = useFlow();

  return (
    <AppScreen>
      <AppBar>
        {!isRoot && (
          <AppBarLeft>
            <AppBarBackButton />
          </AppBarLeft>
        )}

        <AppBarSlot>
          <FakeSearchBar />
        </AppBarSlot>

        <AppBarRight>
          <AppBarIconButton aria-label="알림">
            <IconBellLine />
          </AppBarIconButton>
          <AppBarIconButton aria-label="알림">
            <IconBellLine />
          </AppBarIconButton>
        </AppBarRight>
      </AppBar>
      <AppScreenContent>
        <VStack gap="spacingY.componentDefault" px="spacingX.globalGutter" py="x4">
          <Text as="p" textStyle="articleBody" color="fg.neutral">
            AppBar.Slot은 커스텀 요소에 stackflow 트랜지션 애니메이션을 적용합니다. 이 페이지에서
            뒤로 swipe하면 검색바가 IconButton과 동일하게 fade 트랜지션됩니다.
          </Text>
          <ActionButton onClick={() => push("ActivityAppBarSlot", {})} variant="neutralSolid">
            이 액티비티 다시 열기
          </ActionButton>
        </VStack>
      </AppScreenContent>
    </AppScreen>
  );
};

export default ActivityAppBarSlot;
