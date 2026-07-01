import { Text, VStack } from "@seed-design/react";
import { ActionButton } from "seed-design/ui/action-button";
import {
  DialogAction,
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogRoot,
  DialogTrigger,
} from "seed-design/ui/dialog";

const DialogBodyExample = () => {
  return (
    <DialogRoot size="medium">
      <DialogTrigger asChild>
        <ActionButton variant="neutralSolid">긴 본문 열기</ActionButton>
      </DialogTrigger>
      <DialogContent title="약관 동의" description="아래 내용을 확인해주세요">
        <DialogBody>
          <VStack gap="x4" align="stretch">
            {Array.from({ length: 16 }, (_, index) => (
              <Text key={index} fontSize="t4" color="fg.neutral">
                {index + 1}. 본문이 길어지면 Body 영역만 스크롤됩니다. 스크롤이 시작되면 헤더 아래에
                구분선이 나타나고, 하단은 서서히 사라지는 마스크가 적용됩니다.
              </Text>
            ))}
          </VStack>
        </DialogBody>
        <DialogFooter>
          <DialogAction variant="neutralSolid">동의</DialogAction>
        </DialogFooter>
      </DialogContent>
    </DialogRoot>
  );
};

export default DialogBodyExample;
