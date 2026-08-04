import { HStack } from "@seed-design/react";
import { ActionButton } from "seed-design/ui/action-button";
import { PopoverBody, PopoverContent, PopoverRoot, PopoverTrigger } from "seed-design/ui/popover";

const PopoverShowCloseButton = () => {
  return (
    <HStack gap="x3">
      <PopoverRoot>
        <PopoverTrigger asChild>
          <ActionButton variant="neutralSolid">닫기 버튼 있음</ActionButton>
        </PopoverTrigger>
        <PopoverContent title="닫기 버튼" showCloseButton>
          <PopoverBody>기본적으로 Header 우측에 닫기 버튼이 표시됩니다.</PopoverBody>
        </PopoverContent>
      </PopoverRoot>

      <PopoverRoot>
        <PopoverTrigger asChild>
          <ActionButton variant="neutralSolid">닫기 버튼 없음</ActionButton>
        </PopoverTrigger>
        <PopoverContent title="닫기 버튼 없음" showCloseButton={false}>
          <PopoverBody>
            닫기 버튼을 숨길 때는 본문이나 푸터에 닫을 수 있는 액션을 제공하세요.
          </PopoverBody>
        </PopoverContent>
      </PopoverRoot>
    </HStack>
  );
};

export default PopoverShowCloseButton;
