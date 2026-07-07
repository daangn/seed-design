import { Flex, HStack } from "@seed-design/react";
import { ActionButton } from "seed-design/ui/action-button";
import {
  DialogAction,
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogRoot,
  DialogTrigger,
} from "seed-design/ui/dialog";

const DialogSize = () => {
  return (
    <Flex gap="x3" wrap="wrap">
      <DialogRoot size="medium">
        <DialogTrigger asChild>
          <ActionButton variant="neutralSolid">Medium (480px)</ActionButton>
        </DialogTrigger>
        <DialogContent title="Medium Dialog">
          <DialogBody>기본 너비로 상세 정보와 주요 액션을 함께 제공합니다.</DialogBody>
          <DialogFooter>
            <HStack gap="x2" justify="flex-end">
              <DialogAction variant="neutralWeak">취소</DialogAction>
              <DialogAction variant="neutralSolid">확인</DialogAction>
            </HStack>
          </DialogFooter>
        </DialogContent>
      </DialogRoot>

      <DialogRoot size="large">
        <DialogTrigger asChild>
          <ActionButton variant="neutralSolid">Large (800px)</ActionButton>
        </DialogTrigger>
        <DialogContent title="Large Dialog">
          <DialogBody>넓은 다이얼로그에서 더 많은 폼 필드나 상세 콘텐츠를 다룹니다.</DialogBody>
          <DialogFooter>
            <HStack gap="x2" justify="flex-end">
              <DialogAction variant="neutralWeak">취소</DialogAction>
              <DialogAction variant="neutralSolid">확인</DialogAction>
            </HStack>
          </DialogFooter>
        </DialogContent>
      </DialogRoot>
    </Flex>
  );
};

export default DialogSize;
