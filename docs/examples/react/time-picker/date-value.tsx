"use client";

import { Box, Text, VStack } from "@seed-design/react";
import type { TimePickerValue } from "@seed-design/react-time-picker";
import { TimePicker } from "seed-design/ui/time-picker";
import * as React from "react";

export default function TimePickerDateValue() {
  const [date, setDate] = React.useState(() => new Date(2026, 6, 28, 13, 30));
  const value: TimePickerValue = {
    hour: date.getHours(),
    minute: date.getMinutes(),
  };

  const handleValueChange = ({ hour, minute }: TimePickerValue) => {
    setDate((currentDate) => {
      const nextDate = new Date(currentDate);
      nextDate.setHours(hour, minute, 0, 0);
      return nextDate;
    });
  };

  return (
    <VStack gap="x3" align="center">
      <Box width="358px" maxWidth="100%">
        <TimePicker value={value} onValueChange={handleValueChange} />
      </Box>
      <Text>{date.toLocaleString("ko-KR")}</Text>
    </VStack>
  );
}
