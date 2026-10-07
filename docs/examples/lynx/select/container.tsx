import { useState } from "@lynx-js/react";
import { ActionButton, Box, Text, VStack } from "@seed-design/lynx-react";
import {
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectRoot,
  SelectTrigger,
} from "@/components/ui/select";

export default function Example() {
  const [closeReason, setCloseReason] = useState<string | null>(null);
  const [count, setCount] = useState(0);

  function handleOpenChange(open: boolean, details: { reason: string }) {
    "background only";
    if (!open) setCloseReason(details.reason);
  }

  function handleUnderlyingTap() {
    "background only";
    setCount((current) => current + 1);
  }

  return (
    <VStack width="full" gap="x4">
      <Box width="full">
        <SelectRoot defaultValue={["apple"]} onOpenChange={handleOpenChange}>
          <SelectTrigger accessibility-label="과일" placeholder="과일을 선택하세요" />
          <SelectContent container="window">
            <SelectGroup>
              <SelectItem value="apple" label="사과" />
              <SelectItem value="banana" label="바나나" />
              <SelectItem value="cherry" label="체리" />
            </SelectGroup>
          </SelectContent>
        </SelectRoot>
      </Box>
      <ActionButton variant="neutralWeak" bindtap={handleUnderlyingTap}>
        {`아래 버튼 ${count}`}
      </ActionButton>
      <Text textStyle="t3Regular" color="fg.neutralMuted">
        {`마지막 닫힘 이유: ${closeReason ?? "-"}`}
      </Text>
    </VStack>
  );
}
