import { IconHouseLine } from "@karrotmarket/react-monochrome-icon";
import { HStack, Text, VStack } from "@seed-design/react";
import { useActivityZIndexBase } from "@seed-design/stackflow";
import { useFlow, type StaticActivityComponentType } from "@stackflow/react/future";
import { useState } from "react";
import { ActionButton } from "seed-design/ui/action-button";
import {
  NextAppBar,
  NextAppBarBackButton,
  NextAppBarIconButton,
  NextAppBarLeft,
  NextAppBarMain,
  NextAppBarRight,
} from "seed-design/ui/next-app-bar";
import { NextAppScreen, NextAppScreenContent } from "seed-design/ui/next-app-screen";
import {
  DialogAction,
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogRoot,
  DialogTrigger,
} from "seed-design/ui/dialog";
import { Switch } from "seed-design/ui/switch";

declare module "@stackflow/config" {
  interface Register {
    ActivityDialog: {};
  }
}

const ActivityDialog: StaticActivityComponentType<"ActivityDialog"> = () => {
  const { push } = useFlow();
  const zIndexBase = useActivityZIndexBase();

  const [overflow, setOverflow] = useState(true);

  const paragraphCount = overflow ? 16 : 1;

  return (
    <NextAppScreen>
      <NextAppBar>
        <NextAppBarLeft>
          <NextAppBarBackButton />
        </NextAppBarLeft>
        <NextAppBarMain>Dialog</NextAppBarMain>
        <NextAppBarRight>
          <NextAppBarIconButton aria-label="Home" onClick={() => push("ActivityHome", {})}>
            <IconHouseLine />
          </NextAppBarIconButton>
        </NextAppBarRight>
      </NextAppBar>
      <NextAppScreenContent>
        <VStack gap="x5" align="stretch" style={{ padding: 24 }}>
          <Switch
            tone="neutral"
            size="16"
            label="긴 본문 (오버플로)"
            checked={overflow}
            onCheckedChange={setOverflow}
          />
          <DialogRoot size="medium">
            <DialogTrigger asChild>
              <ActionButton variant="neutralSolid">다이얼로그 열기</ActionButton>
            </DialogTrigger>
            <DialogContent
              layerIndex={zIndexBase}
              title="스크롤 테스트"
              description="body가 오버플로일 때만 하단 fade와 padding-bottom이 적용됩니다"
            >
              <DialogBody>
                <VStack gap="x4" align="stretch">
                  {Array.from({ length: paragraphCount }, (_, index) => (
                    <Text key={index} fontSize="t4" color="fg.neutral">
                      {index + 1}. 본문이 길어지면 Body 영역만 스크롤됩니다. 오버플로 상태에서만
                      하단이 서서히 사라지는 마스크와 padding-bottom이 적용되고, 스크롤하면 헤더
                      아래에 구분선이 나타납니다.
                    </Text>
                  ))}
                </VStack>
              </DialogBody>
              <DialogFooter>
                <HStack gap="x2" justify="flex-end">
                  <DialogAction variant="neutralWeak">취소</DialogAction>
                  <DialogAction variant="neutralSolid">확인</DialogAction>
                </HStack>
              </DialogFooter>
            </DialogContent>
          </DialogRoot>
        </VStack>
      </NextAppScreenContent>
    </NextAppScreen>
  );
};

export default ActivityDialog;
