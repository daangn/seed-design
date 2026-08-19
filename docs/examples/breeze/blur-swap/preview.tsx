"use client";

import { Text, VStack } from "@seed-design/react";
import { useState } from "react";
import { BlurSwap } from "seed-design/breeze/blur-swap/blur-swap";
import { ActionButton } from "seed-design/ui/action-button";

const STATUSES = ["결제 완료", "상품 준비 중", "배송 중", "배송 완료"];

export default function BlurSwapPreview() {
  const [index, setIndex] = useState(0);

  return (
    <VStack gap="x6" align="center">
      <BlurSwap activeKey={index}>
        <Text textStyle="t8Bold" color="fg.neutral">
          {STATUSES[index]}
        </Text>
      </BlurSwap>

      <ActionButton
        size="small"
        variant="neutralSolid"
        onClick={() => setIndex((current) => (current + 1) % STATUSES.length)}
      >
        다음 상태
      </ActionButton>
    </VStack>
  );
}
