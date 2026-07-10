import { HStack, Text, VStack } from "@seed-design/react";
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
    <VStack gap="x3" align="stretch">
      <DialogRoot size="medium">
        <DialogTrigger asChild>
          <ActionButton variant="neutralWeak">짧은 본문 (fade 없음)</ActionButton>
        </DialogTrigger>
        <DialogContent
          title="짧은 본문"
          description="Body가 넘치지 않으면 하단 fade와 padding-bottom이 적용되지 않습니다"
        >
          <DialogBody>
            <Text textStyle="articleBody">
              내용이 짧아 스크롤이 없으면 하단 마스크가 적용되지 않아, 마지막 줄이 흐려지지
              않습니다.
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

      <DialogRoot size="medium">
        <DialogTrigger asChild>
          <ActionButton variant="neutralSolid">긴 본문 (fade 적용)</ActionButton>
        </DialogTrigger>
        <DialogContent
          title="긴 본문"
          description="Body가 넘쳐 스크롤되면 하단이 서서히 사라집니다"
        >
          <DialogBody>
            <VStack gap="x4" align="stretch">
              {Array.from({ length: 16 }, (_, index) => (
                <Text key={index} textStyle="articleBody">
                  {index + 1}. Body가 넘치면 하단에 fade 마스크와 padding-bottom이 적용되고,
                  스크롤하면 헤더 아래에 구분선이 나타납니다.
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
  );
};

export default DialogBodyExample;
