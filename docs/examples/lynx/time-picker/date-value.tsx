import * as React from "@lynx-js/react";
import { Box, Text, type TimePickerValue, VStack } from "@seed-design/lynx-react";

import { TimePicker } from "@/components/ui/time-picker";

// Lynx에는 `Intl`이 없어 `toLocaleString("ko-KR")` 대신 직접 포맷합니다.
function formatDate(date: Date) {
  const hour = date.getHours();
  const period = hour < 12 ? "오전" : "오후";
  const displayHour = hour % 12 || 12;
  const minute = String(date.getMinutes()).padStart(2, "0");
  const second = String(date.getSeconds()).padStart(2, "0");

  return `${date.getFullYear()}. ${date.getMonth() + 1}. ${date.getDate()}. ${period} ${displayHour}:${minute}:${second}`;
}

export default function TimePickerDateValue() {
  const [date, setDate] = React.useState(() => new Date(2026, 6, 28, 13, 30));
  const value: TimePickerValue = {
    hour: date.getHours(),
    minute: date.getMinutes(),
  };

  const handleValueChange = ({ hour, minute }: TimePickerValue) => {
    "background only";
    setDate((currentDate) => {
      const nextDate = new Date(currentDate);
      nextDate.setHours(hour, minute, 0, 0);
      return nextDate;
    });
  };

  return (
    <VStack width="full" gap="x3" align="center">
      <Box width="full" maxWidth="358px">
        <TimePicker value={value} onValueChange={handleValueChange} />
      </Box>
      <Text>{formatDate(date)}</Text>
    </VStack>
  );
}
