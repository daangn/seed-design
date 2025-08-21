"use client";

import AnimateNumber from "@/registry/bits/animate-number/animate-number";
import { ActionButton } from "@/registry/ui/action-button";
import { HStack } from "@seed-design/react";
import { useState } from "react";

export default function AnimateNumberPreview() {
  const [value, setValue] = useState(1);

  return (
    <div className="flex flex-col items-center gap-8">
      <AnimateNumber
        value={value}
        fontSize="6rem"
        fontWeight="bold"
        color="#333"
        showComma
        showGradient
        gradientHeight={10}
      />
      <HStack gap="10px">
        <ActionButton size="small" variant="neutralSolid" onClick={() => setValue(value - 1)}>
          -1
        </ActionButton>
        <ActionButton size="small" variant="neutralSolid" onClick={() => setValue(value + 1)}>
          +1
        </ActionButton>
      </HStack>
    </div>
  );
}
