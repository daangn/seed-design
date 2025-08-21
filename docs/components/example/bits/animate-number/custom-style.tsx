"use client";

import AnimateNumber from "@/registry/bits/animate-number/animate-number";
import { ActionButton } from "@/registry/ui/action-button";
import { HStack } from "@seed-design/react";
import { useState } from "react";

export default function AnimateNumberCustomStyle() {
  const [value, setValue] = useState(42);

  return (
    <div className="flex flex-col items-center gap-6">
      <AnimateNumber
        value={value}
        fontSize="2.5rem"
        fontWeight="600"
        color="#FF6B00"
        containerStyle={{ padding: "1rem" }}
      />

      <HStack gap="10px">
        <ActionButton
          size="small"
          variant="neutralSolid"
          onClick={() => setValue(Math.floor(Math.random() * 99999) + 1)}
        >
          랜덤 숫자
        </ActionButton>
      </HStack>
    </div>
  );
}
