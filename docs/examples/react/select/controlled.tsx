"use client";

import { VStack } from "@seed-design/react";
import * as React from "react";
import {
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectRoot,
  SelectTrigger,
} from "seed-design/ui/select";

export default function SelectControlled() {
  const [value, setValue] = React.useState<string[]>(["apple"]);

  return (
    <VStack gap="x2" width="240px">
      <SelectRoot value={value} onValueChange={setValue}>
        <SelectTrigger aria-label="과일" placeholder="과일 선택" />
        <SelectContent>
          <SelectGroup>
            <SelectItem value="apple" label="사과" />
            <SelectItem value="banana" label="바나나" />
            <SelectItem value="cherry" label="체리" />
          </SelectGroup>
        </SelectContent>
      </SelectRoot>
      <span>선택된 값: {value.length > 0 ? value.join(", ") : "없음"}</span>
    </VStack>
  );
}
