import { HStack } from "@seed-design/react";
import { ActionButton } from "seed-design/ui/action-button";
import {
  PopoverAction,
  PopoverBody,
  PopoverContent,
  PopoverFooter,
  PopoverRoot,
  PopoverTrigger,
} from "seed-design/ui/popover";

export default function PopoverTriggerExample() {
  return (
    <PopoverRoot>
      <PopoverTrigger asChild>
        <ActionButton variant="neutralSolid">Trigger</ActionButton>
      </PopoverTrigger>
      <PopoverContent title="제목">
        <PopoverBody>트리거를 눌러 Popover를 열 수 있습니다.</PopoverBody>
        <PopoverFooter>
          <HStack gap="x2" justify="flex-end">
            <PopoverAction variant="neutralSolid">확인</PopoverAction>
          </HStack>
        </PopoverFooter>
      </PopoverContent>
    </PopoverRoot>
  );
}
