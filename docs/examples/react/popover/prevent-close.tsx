import { HStack } from "@seed-design/react";
import { useState } from "react";
import { ActionButton } from "seed-design/ui/action-button";
import {
  PopoverAction,
  PopoverBody,
  PopoverContent,
  PopoverFooter,
  PopoverRoot,
  PopoverTrigger,
} from "seed-design/ui/popover";
import { Switch } from "seed-design/ui/switch";

export default function PopoverPreventClose() {
  const [preventClose, setPreventClose] = useState(true);

  return (
    <PopoverRoot>
      <PopoverTrigger asChild>
        <ActionButton variant="neutralSolid">열기</ActionButton>
      </PopoverTrigger>
      <PopoverContent
        title="닫기 방지"
        description="확인 버튼을 눌러도 Popover가 닫히지 않도록 설정할 수 있습니다."
      >
        <PopoverBody>
          <Switch
            size="16"
            tone="neutral"
            label="preventDefault 사용"
            checked={preventClose}
            onCheckedChange={setPreventClose}
          />
        </PopoverBody>
        <PopoverFooter>
          <HStack gap="x2" justify="flex-end">
            <PopoverAction variant="neutralWeak">취소</PopoverAction>
            <PopoverAction
              variant="neutralSolid"
              onClick={(e) => {
                if (preventClose) e.preventDefault();
              }}
            >
              확인
            </PopoverAction>
          </HStack>
        </PopoverFooter>
      </PopoverContent>
    </PopoverRoot>
  );
}
