import { Flex, HStack, Text, VStack } from "@seed-design/react";
import { useState } from "react";
import { ActionButton } from "seed-design/ui/action-button";
import {
  DialogAction,
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogRoot,
  DialogTrigger,
} from "seed-design/ui/dialog";
import { Slider } from "seed-design/ui/slider";

const DialogSize = () => {
  const [width, setWidth] = useState(90);
  const [maxWidth, setMaxWidth] = useState(640);

  return (
    <Flex gap="x3" wrap="wrap">
      <DialogRoot size="medium">
        <DialogTrigger asChild>
          <ActionButton variant="neutralSolid">Medium (480px)</ActionButton>
        </DialogTrigger>
        <DialogContent title="Medium Dialog">
          <DialogBody>
            <Text textStyle="articleBody">
              기본 너비로 상세 정보와 주요 액션을 함께 제공합니다.
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

      <DialogRoot size="large">
        <DialogTrigger asChild>
          <ActionButton variant="neutralSolid">Large (800px)</ActionButton>
        </DialogTrigger>
        <DialogContent title="Large Dialog">
          <DialogBody>
            <Text textStyle="articleBody">
              넓은 다이얼로그에서 더 많은 폼 필드나 상세 콘텐츠를 다룹니다.
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
          <ActionButton variant="neutralSolid">Custom (조절 가능)</ActionButton>
        </DialogTrigger>
        <DialogContent title="Custom Size" width={`${width}vw`} maxWidth={`${maxWidth}px`}>
          <DialogBody>
            <VStack gap="x4">
              <Text textStyle="articleBody">
                뷰포트 너비에 따라 유동적으로 커지되 maxWidth로 최대 크기를 제한합니다.
              </Text>
              <Slider
                label="width (vw)"
                min={50}
                max={100}
                values={[width]}
                onValuesChange={(values) => setWidth(values[0])}
              />
              <Slider
                label="maxWidth (px)"
                min={320}
                max={800}
                values={[maxWidth]}
                onValuesChange={(values) => setMaxWidth(values[0])}
              />
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

export default DialogSize;
