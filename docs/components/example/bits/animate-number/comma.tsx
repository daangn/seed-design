"use client";

import AnimateNumber from "@/registry/bits/animate-number/animate-number";
import { ActionButton } from "@/registry/ui/action-button";
import { useState } from "react";

export default function AnimateNumberComma() {
  const [value, setValue] = useState(1234);

  return (
    <div className="flex flex-col items-center gap-6">
      <AnimateNumber value={value} fontSize="3rem" showComma />

      <ActionButton
        size="small"
        variant="neutralSolid"
        onClick={() => setValue(Math.floor(Math.random() * 99999) + 1)}
      >
        랜덤 숫자 (1-99999)
      </ActionButton>
    </div>
  );
}
