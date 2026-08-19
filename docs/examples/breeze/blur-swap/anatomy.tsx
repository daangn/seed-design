"use client";

import { Text, VStack } from "@seed-design/react";
import { useState } from "react";
import { BlurSwap } from "seed-design/breeze/blur-swap/blur-swap";
import { ActionButton } from "seed-design/ui/action-button";
import { SegmentedControl, SegmentedControlItem } from "seed-design/ui/segmented-control";

const SPEEDS = [
  { id: "1x", duration: 400 },
  { id: "0.5x", duration: 800 },
  { id: "0.25x", duration: 1600 },
];

const WEATHERS = ["맑음", "흐림", "비", "천둥번개"];

export default function BlurSwapAnatomy() {
  const [speedId, setSpeedId] = useState(SPEEDS[0].id);
  const [index, setIndex] = useState(0);

  const speed = SPEEDS.find((candidate) => candidate.id === speedId) ?? SPEEDS[0];

  return (
    <VStack gap="x6" align="center">
      <SegmentedControl aria-label="재생 속도" value={speedId} onValueChange={setSpeedId}>
        {SPEEDS.map((candidate) => (
          <SegmentedControlItem key={candidate.id} value={candidate.id}>
            {candidate.id}
          </SegmentedControlItem>
        ))}
      </SegmentedControl>

      <BlurSwap activeKey={index} duration={speed.duration}>
        <Text textStyle="t9Bold" color="fg.neutral">
          {WEATHERS[index]}
        </Text>
      </BlurSwap>

      <ActionButton
        size="small"
        variant="neutralSolid"
        onClick={() => setIndex((current) => (current + 1) % WEATHERS.length)}
      >
        날씨 바꾸기
      </ActionButton>
    </VStack>
  );
}
