import { Flex } from "@seed-design/react";
import { ActionButton } from "seed-design/ui/action-button";
import { DialogBody, DialogContent, DialogRoot, DialogTrigger } from "seed-design/ui/dialog";

const DialogShowCloseButton = () => {
  return (
    <Flex gap="x3">
      <DialogRoot>
        <DialogTrigger asChild>
          <ActionButton variant="neutralSolid">닫기 버튼 있음</ActionButton>
        </DialogTrigger>
        <DialogContent title="닫기 버튼" showCloseButton>
          <DialogBody>기본적으로 우측 상단에 닫기 버튼이 표시됩니다.</DialogBody>
        </DialogContent>
      </DialogRoot>

      <DialogRoot>
        <DialogTrigger asChild>
          <ActionButton variant="neutralSolid">닫기 버튼 없음</ActionButton>
        </DialogTrigger>
        <DialogContent title="닫기 버튼 없음" showCloseButton={false}>
          <DialogBody>
            닫기 버튼을 숨길 때는 본문이나 푸터에 닫을 수 있는 액션을 제공하세요.
          </DialogBody>
        </DialogContent>
      </DialogRoot>
    </Flex>
  );
};

export default DialogShowCloseButton;
