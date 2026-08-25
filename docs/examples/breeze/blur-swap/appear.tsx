"use client";

import { Text, VStack } from "@seed-design/react";
import { useState } from "react";
import { BlurSwap } from "seed-design/breeze/blur-swap/blur-swap";
import { ActionButton } from "seed-design/ui/action-button";

const NOTICES = [null, "저장했어요", null, "링크를 복사했어요"];

export default function BlurSwapAppear() {
  const [index, setIndex] = useState(0);

  const notice = NOTICES[index];

  return (
    <VStack gap="x3" width="280px" height="100px" justify="flex-start">
      <ActionButton
        size="small"
        variant="neutralSolid"
        onClick={() => setIndex((current) => (current + 1) % NOTICES.length)}
      >
        {notice ? "메시지 지우기" : "메시지 띄우기"}
      </ActionButton>

      <BlurSwap activeKey={index} size="height">
        {notice && (
          <Text textStyle="t4Regular" color="fg.neutralMuted">
            {notice}
          </Text>
        )}
      </BlurSwap>
    </VStack>
  );
}
