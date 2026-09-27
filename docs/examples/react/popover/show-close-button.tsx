import { HStack } from "@seed-design/react";
import { useState } from "react";
import { ActionButton } from "seed-design/ui/action-button";
import {
  PopoverBody,
  PopoverContent,
  PopoverFooter,
  PopoverRoot,
  PopoverTrigger,
} from "seed-design/ui/popover";

export default function PopoverShowCloseButton() {
  const [withCloseButtonOpen, setWithCloseButtonOpen] = useState(false);
  const [withoutCloseButtonOpen, setWithoutCloseButtonOpen] = useState(false);

  return (
    <HStack gap="x3">
      <PopoverRoot open={withCloseButtonOpen} onOpenChange={setWithCloseButtonOpen}>
        <PopoverTrigger asChild>
          <ActionButton variant="neutralSolid">닫기 버튼 있음</ActionButton>
        </PopoverTrigger>
        <PopoverContent title="닫기 버튼" showCloseButton>
          <PopoverBody>기본적으로 Header 우측에 닫기 버튼이 표시됩니다.</PopoverBody>
          <PopoverFooter>
            <HStack gap="x2" justify="flex-end">
              <ActionButton variant="neutralSolid" onClick={() => setWithCloseButtonOpen(false)}>
                확인
              </ActionButton>
            </HStack>
          </PopoverFooter>
        </PopoverContent>
      </PopoverRoot>

      <PopoverRoot open={withoutCloseButtonOpen} onOpenChange={setWithoutCloseButtonOpen}>
        <PopoverTrigger asChild>
          <ActionButton variant="neutralSolid">닫기 버튼 없음</ActionButton>
        </PopoverTrigger>
        <PopoverContent title="닫기 버튼 없음" showCloseButton={false}>
          <PopoverBody>
            닫기 버튼을 숨길 때는 본문이나 푸터에 닫을 수 있는 액션을 제공하세요.
          </PopoverBody>
          <PopoverFooter>
            <HStack gap="x2" justify="flex-end">
              <ActionButton variant="neutralSolid" onClick={() => setWithoutCloseButtonOpen(false)}>
                확인
              </ActionButton>
            </HStack>
          </PopoverFooter>
        </PopoverContent>
      </PopoverRoot>
    </HStack>
  );
}
