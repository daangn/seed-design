import { HStack, VStack } from "@seed-design/react";
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

export default function PopoverControlled() {
  const [open, setOpen] = useState(false);

  return (
    <VStack gap="spacingY.componentDefault" align="center">
      <Switch size="24" tone="neutral" label="열림" checked={open} onCheckedChange={setOpen} />
      <PopoverRoot open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <ActionButton variant="neutralSolid">Popover</ActionButton>
        </PopoverTrigger>
        <PopoverContent title="제어 상태">
          <PopoverBody>open prop으로 Popover의 열림 상태를 직접 제어합니다.</PopoverBody>
          <PopoverFooter>
            <HStack gap="x2" justify="flex-end">
              <PopoverAction variant="neutralSolid">확인</PopoverAction>
            </HStack>
          </PopoverFooter>
        </PopoverContent>
      </PopoverRoot>
    </VStack>
  );
}
