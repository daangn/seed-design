import { VStack } from "@seed-design/react";
import * as React from "react";
import { ActionButton } from "seed-design/ui/action-button";
import {
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectRoot,
  SelectTrigger,
} from "seed-design/ui/select";

export default function SelectControlledOpen() {
  const [open, setOpen] = React.useState(false);

  return (
    <VStack gap="x2" width="240px">
      <SelectRoot open={open} onOpenChange={setOpen} defaultValue={["apple"]}>
        <SelectTrigger aria-label="과일" placeholder="과일 선택" />
        <SelectContent>
          <SelectGroup>
            <SelectItem value="apple" label="사과" />
            <SelectItem value="banana" label="바나나" />
            <SelectItem value="cherry" label="체리" />
          </SelectGroup>
        </SelectContent>
      </SelectRoot>
      <ActionButton variant="neutralWeak" disabled={open} onClick={() => setOpen(true)}>
        목록 열기
      </ActionButton>
      <span>목록 상태: {open ? "열림" : "닫힘"}</span>
    </VStack>
  );
}
