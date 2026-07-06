"use client";

import * as React from "react";
import {
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectRoot,
  SelectTrigger,
} from "seed-design/ui/select";

export default function SelectControlled() {
  const [value, setValue] = React.useState<string | null>("apple");

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8, width: 240 }}>
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
      <span>선택된 값: {value ?? "없음"}</span>
    </div>
  );
}
