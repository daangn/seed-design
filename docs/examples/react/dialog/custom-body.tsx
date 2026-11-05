import { Box, Flex, HStack, Text, VStack } from "@seed-design/react";
import { ActionButton } from "seed-design/ui/action-button";
import {
  DialogAction,
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogRoot,
  DialogTrigger,
} from "seed-design/ui/dialog";

const DialogCustomBody = () => {
  return (
    <Flex gap="x3" wrap="wrap">
      <DialogRoot>
        <DialogTrigger asChild>
          <ActionButton variant="neutralSolid">maxHeight 200px</ActionButton>
        </DialogTrigger>
        <DialogContent
          title="본문 최대 높이"
          description="본문(Body)의 스크롤 높이를 200px로 제한합니다"
        >
          <DialogBody maxHeight="200px">
            <VStack gap="x4" align="stretch">
              {Array.from({ length: 12 }, (_, index) => (
                <Text key={index} textStyle="articleBody">
                  {index + 1}. 본문이 200px을 넘으면 그 안에서 스크롤됩니다.
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

      <DialogRoot>
        <DialogTrigger asChild>
          <ActionButton variant="neutralSolid">minHeight + 가운데 정렬</ActionButton>
        </DialogTrigger>
        <DialogContent title="빈 상태" description="짧은 내용에서도 높이를 고정합니다">
          <DialogBody minHeight="240px" justifyContent="center" alignItems="center">
            <Text textStyle="articleBody" color="fg.neutralMuted">
              아직 항목이 없습니다
            </Text>
          </DialogBody>
          <DialogFooter>
            <HStack gap="x2" justify="flex-end">
              <DialogAction variant="neutralWeak">취소</DialogAction>
              <DialogAction variant="neutralSolid">추가</DialogAction>
            </HStack>
          </DialogFooter>
        </DialogContent>
      </DialogRoot>

      <DialogRoot>
        <DialogTrigger asChild>
          <ActionButton variant="neutralSolid">paddingX 0</ActionButton>
        </DialogTrigger>
        <DialogContent
          title="Full Bleed"
          description="가로 패딩을 제거해 콘텐츠를 가장자리까지 배치합니다"
        >
          <DialogBody paddingX={0}>
            <Box bg="palette.gray200" paddingY="x8">
              <Text textStyle="articleBody">가장자리까지 닿는 영역입니다</Text>
            </Box>
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

export default DialogCustomBody;
