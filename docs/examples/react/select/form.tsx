"use client";

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

export default function SelectForm() {
  const [submitted, setSubmitted] = React.useState<string | null>(null);

  return (
    <VStack asChild gap="x2" width="240px">
      <form
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
        <ActionButton type="submit" variant="neutralSolid">
          제출
        </ActionButton>
        {submitted && <span>제출된 값: {submitted}</span>}
      </form>
    </VStack>
  );
}
