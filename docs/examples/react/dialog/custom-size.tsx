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

const DialogCustomSize = () => {
  return (
    <Flex gap="x3" wrap="wrap">
      <DialogRoot>
        <DialogTrigger asChild>
          <ActionButton variant="neutralSolid">width 90vw, max 640px</ActionButton>
        </DialogTrigger>
        <DialogContent title="Fluid Width" width="90vw" maxWidth="640px">
          <DialogBody>
            <Text textStyle="articleBody">
              뷰포트 너비에 따라 커지되 최대 640px까지만 확장됩니다.
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

      <DialogRoot>
        <DialogTrigger asChild>
          <ActionButton variant="neutralSolid">width 400px</ActionButton>
        </DialogTrigger>
        <DialogContent title="Fixed Width" width="400px">
          <DialogBody>
            <Text textStyle="articleBody">
              고정 너비가 필요한 작업 다이얼로그에 사용할 수 있습니다.
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

export default DialogCustomSize;
