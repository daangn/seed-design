import "./styles";

import { useState } from "@lynx-js/react";
import { ActionButton, Box, VStack, useSeedClassName } from "@seed-design/lynx-react";
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
  return (
    <view className={`${seedClassName} docs-lynx-select-root`}>
      <VStack className="select-preview" gap="x2">
        <Box width="240px">
          <SelectRoot open={open} onOpenChange={setOpen} defaultValue={["apple"]}>
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
        <ActionButton variant="neutralWeak" disabled={open} bindtap={() => setOpen(true)}>
          목록 열기
        </ActionButton>
        <text className="select-preview__status">목록 상태: {open ? "열림" : "닫힘"}</text>
      </VStack>
    </view>
  );
}
