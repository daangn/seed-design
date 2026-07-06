"use client";

import * as React from "react";
import {
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectRoot,
  SelectTrigger,
} from "seed-design/ui/select";

export default function SelectForm() {
  const [submitted, setSubmitted] = React.useState<string | null>(null);

  return (
    <form
      style={{ display: "flex", flexDirection: "column", gap: 8, width: 240 }}
      onSubmit={(event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        setSubmitted(String(data.get("fruit")));
      }}
    >
      <SelectRoot name="fruit" required>
        <SelectTrigger aria-label="과일" placeholder="과일 선택" />
        <SelectContent>
          <SelectGroup>
            <SelectItem value="apple" label="사과" />
            <SelectItem value="banana" label="바나나" />
            <SelectItem value="cherry" label="체리" />
          </SelectGroup>
        </SelectContent>
      </SelectRoot>
      <button type="submit">제출</button>
      {submitted && <span>제출된 값: {submitted}</span>}
    </form>
  );
}
