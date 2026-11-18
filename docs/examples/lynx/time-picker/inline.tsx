import * as React from "@lynx-js/react";
import { ActionButton, HStack, Text, type TimePickerValue, VStack } from "@seed-design/lynx-react";

import { TimePicker } from "@/components/ui/time-picker";

function formatTime({ hour, minute }: TimePickerValue) {
  const period = hour < 12 ? "오전" : "오후";
  const displayHour = hour % 12 || 12;

  return `${period} ${displayHour}:${String(minute).padStart(2, "0")}`;
}

export default function TimePickerInline() {
  const [value, setValue] = React.useState<TimePickerValue>({ hour: 10, minute: 30 });
  const [savedValue, setSavedValue] = React.useState(value);

  return (
    <VStack width="full" maxWidth="358px" gap="x4">
      <VStack gap="x1">
        <Text textStyle="t5Bold">영업 시작 시간</Text>
        <Text color="fg.neutralMuted">현재 설정: {formatTime(savedValue)}</Text>
      </VStack>
      <TimePicker
        periodAccessibilityLabel="영업 시작 시간, 오전/오후"
        hourAccessibilityLabel="영업 시작 시간, 시"
        minuteAccessibilityLabel="영업 시작 시간, 분"
        value={value}
        onValueChange={setValue}
      />
      <HStack justify="flex-end">
        <ActionButton
          variant="neutralSolid"
          bindtap={() => {
            "background only";
            setSavedValue(value);
          }}
        >
          완료
        </ActionButton>
      </HStack>
    </VStack>
  );
}
