"use client";

import { Box, Text, VStack } from "@seed-design/react";
import { useState } from "react";
import { BlurSwap } from "seed-design/breeze/blur-swap/blur-swap";
import { SegmentedControl, SegmentedControlItem } from "seed-design/ui/segmented-control";

const PLANS = [
  { id: "basic", name: "베이직", lines: ["월 4,900원", "기본 기능 전체"] },
  {
    id: "pro",
    name: "프로",
    lines: ["월 9,900원", "기본 기능 전체", "우선 지원", "리포트 내보내기", "팀 멤버 5명"],
  },
];

export default function BlurSwapPanel() {
  const [planId, setPlanId] = useState(PLANS[0].id);

  const plan = PLANS.find((candidate) => candidate.id === planId) ?? PLANS[0];

  // 패널은 아래로만 자라야 요금제를 고르는 손끝에서 컨트롤이 달아나지 않는다.
  return (
    <VStack gap="x4" width="280px" height="240px" justify="flex-start">
      <SegmentedControl aria-label="요금제" value={planId} onValueChange={setPlanId}>
        {PLANS.map((candidate) => (
          <SegmentedControlItem key={candidate.id} value={candidate.id}>
            {candidate.name}
          </SegmentedControlItem>
        ))}
      </SegmentedControl>

      <Box borderWidth={1} borderColor="stroke.neutralMuted" borderRadius="r3" padding="x4">
        <BlurSwap activeKey={planId} size="height">
          <VStack gap="x2">
            {plan.lines.map((line) => (
              <Text key={line} textStyle="t4Regular" color="fg.neutral">
                {line}
              </Text>
            ))}
          </VStack>
        </BlurSwap>
      </Box>
    </VStack>
  );
}
