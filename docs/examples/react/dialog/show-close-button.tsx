import { Flex, HStack, Text } from "@seed-design/react";
import { ActionButton } from "seed-design/ui/action-button";
import {
  DialogAction,
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogRoot,
  DialogTrigger,
} from "seed-design/ui/dialog";

const DialogShowCloseButton = () => {
  return (
    <Flex gap="x3">
      <DialogRoot>
        <DialogTrigger asChild>
          <ActionButton variant="neutralSolid">닫기 버튼 있음</ActionButton>
        </DialogTrigger>
        <DialogContent title="닫기 버튼" showCloseButton>
          <DialogBody>
            <Text textStyle="articleBody">기본적으로 우측 상단에 닫기 버튼이 표시됩니다.</Text>
          </DialogBody>
          <DialogFooter>
            <HStack gap="x2" justify="flex-end">
              <DialogAction variant="neutralWeak">취소</DialogAction>
              <DialogAction variant="neutralSolid">확인</DialogAction>
            </HStack>
          </DialogFooter>
        </DialogContent>
      </DialogRoot>

      <DialogRoot>
        <DialogTrigger asChild>
          <ActionButton variant="neutralSolid">닫기 버튼 없음</ActionButton>
        </DialogTrigger>
        <DialogContent title="닫기 버튼 없음" showCloseButton={false}>
          <DialogBody>
            <Text textStyle="articleBody">
              닫기 버튼을 숨길 때는 본문이나 푸터에 닫을 수 있는 액션을 제공하세요.
            </Text>
          </DialogBody>
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

export default DialogShowCloseButton;
