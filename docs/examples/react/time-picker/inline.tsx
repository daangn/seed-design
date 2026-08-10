"use client";

import { Box, HStack, Text, TimePicker, VStack, type TimePickerValue } from "@seed-design/react";
import { ActionButton } from "seed-design/ui/action-button";
import * as React from "react";

function formatTime({ hour, minute }: TimePickerValue) {
  const period = hour < 12 ? "오전" : "오후";
  const displayHour = hour % 12 || 12;

  return `${period} ${displayHour}:${String(minute).padStart(2, "0")}`;
}

export default function TimePickerInline() {
  const [value, setValue] = React.useState<TimePickerValue>({ hour: 10, minute: 30 });
  const [savedValue, setSavedValue] = React.useState(value);

  return (
    <VStack width="358px" maxWidth="100%" gap="x4">
      <VStack gap="x1">
        <Text id="business-open-time-label" textStyle="t5Bold">
          영업 시작 시간
        </Text>
        <Text color="fg.neutralMuted">현재 설정: {formatTime(savedValue)}</Text>
      </VStack>
      <Box width="full">
        <TimePicker
          aria-labelledby="business-open-time-label"
          value={value}
          onValueChange={setValue}
        />
      </Box>
      <HStack justify="flex-end">
        <ActionButton variant="neutralSolid" onClick={() => setSavedValue(value)}>
          완료
        </ActionButton>
      </HStack>
    </VStack>
  );
}
