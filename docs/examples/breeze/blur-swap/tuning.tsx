"use client";

import { HStack, Text, VStack } from "@seed-design/react";
import { useState } from "react";
import { BlurSwap } from "seed-design/breeze/blur-swap/blur-swap";
import { ActionButton } from "seed-design/ui/action-button";

const PRESETS = [
  { id: "flat", label: "blur 0 / offset 8", blur: 0, offset: 8 },
  { id: "default", label: "blur 4 / offset 8", blur: 4, offset: 8 },
  { id: "soft", label: "blur 12 / offset 20", blur: 12, offset: 20 },
];

export default function BlurSwapTuning() {
  const [count, setCount] = useState(1);

  return (
    <VStack gap="x6" align="center">
      <HStack gap="x8" align="center">
        {PRESETS.map((preset) => (
          <VStack key={preset.id} gap="x2" align="center">
            <BlurSwap activeKey={count} blur={preset.blur} offset={preset.offset}>
              <Text textStyle="t9Bold" color="fg.neutral">
                {count.toLocaleString()}
              </Text>
            </BlurSwap>
            <Text textStyle="t3Regular" color="fg.neutralMuted">
              {preset.label}
            </Text>
          </VStack>
        ))}
      </HStack>

      <ActionButton
        size="small"
        variant="neutralSolid"
        onClick={() => setCount((current) => current * 7 + 3)}
      >
        값 바꾸기
      </ActionButton>
    </VStack>
  );
}
