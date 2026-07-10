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
          <ActionButton variant="neutralSolid">maxHeight 320px</ActionButton>
        </DialogTrigger>
        <DialogContent
          title="본문 최대 높이"
          description="기본 캡(뷰포트의 80%)보다 낮게 제한합니다"
        >
          <DialogBody maxHeight="320px">
            <VStack gap="x4" align="stretch">
              {Array.from({ length: 12 }, (_, index) => (
                <Text key={index} textStyle="articleBody">
                  {index + 1}. 본문이 320px을 넘으면 그 안에서 스크롤됩니다.
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
            <VStack align="stretch">
              {["항목 1", "항목 2", "항목 3"].map((label) => (
                <Box
                  key={label}
                  paddingX="x6"
                  paddingY="x3"
                  _active={{ bg: "bg.transparentPressed" }}
                >
                  <Text textStyle="articleBody">{label}</Text>
                </Box>
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
    </Flex>
  );
};

export default DialogCustomBody;
