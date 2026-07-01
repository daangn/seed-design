import { Box, HStack, VStack } from "@seed-design/react";
import { ActionButton } from "seed-design/ui/action-button";
import {
  DialogAction,
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogRoot,
  DialogTrigger,
} from "seed-design/ui/dialog";

const DialogFooterLayout = () => {
  return (
    <DialogRoot size="medium">
      <DialogTrigger asChild>
        <ActionButton variant="neutralSolid">Footer 레이아웃</ActionButton>
      </DialogTrigger>
      <DialogContent
        title="Footer 레이아웃"
        description="버튼 배치는 VStack, HStack 등으로 직접 구성합니다."
      >
        <DialogBody>
          <VStack gap="x3" align="stretch">
            <Box>DialogFooter는 flex 레이아웃만 제공합니다.</Box>
            <Box>넓은 다이얼로그에서는 주요 액션을 우측에 가로로 정렬할 수 있습니다.</Box>
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
  );
};

export default DialogFooterLayout;
