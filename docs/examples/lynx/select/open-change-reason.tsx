import "./styles";

import { useState } from "@lynx-js/react";
import { Box, HStack, VStack, useSeedClassName } from "@seed-design/lynx-react";
import {
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectRoot,
  SelectTrigger,
} from "@/components/ui/select";

export default function Example() {
  const seedClassName = useSeedClassName({ colorMode: "system" });
  const [open, setOpen] = useState(false);
  const [openReason, setOpenReason] = useState<string | null>(null);
  const [closeReason, setCloseReason] = useState<string | null>(null);
  function handleOpenChange(nextOpen: boolean, details: { reason: string }) {
    "background only";
    setOpen(nextOpen);
    (nextOpen ? setOpenReason : setCloseReason)(details.reason);
  }
  return (
    <view className={`${seedClassName} docs-lynx-select-root`}>
      <VStack className="select-preview" gap="x4">
        <Box width="240px">
          <SelectRoot open={open} onOpenChange={handleOpenChange} defaultValue={["apple"]}>
            <SelectTrigger accessibility-label="과일" placeholder="과일 선택" />
            <SelectContent>
              <SelectGroup>
                <SelectItem value="apple" label="사과" />
                <SelectItem value="banana" label="바나나" />
                <SelectItem value="cherry" label="체리" />
              </SelectGroup>
            </SelectContent>
          </SelectRoot>
        </Box>
        <HStack gap="x4">
          <text className="select-preview__status">마지막 열림 이유: {openReason ?? "-"}</text>
          <text className="select-preview__status">마지막 닫힘 이유: {closeReason ?? "-"}</text>
        </HStack>
      </VStack>
    </view>
  );
}
