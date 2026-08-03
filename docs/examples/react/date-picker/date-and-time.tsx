"use client";

import {
  Box,
  DatePicker,
  Text,
  TimePicker,
  VStack,
  type DatePickerDate,
  type TimePickerValue,
} from "@seed-design/react";
import * as React from "react";

const TODAY: DatePickerDate = { year: 2026, month: 7, day: 30 };

export default function DatePickerDateAndTime() {
  const [date, setDate] = React.useState<DatePickerDate>(TODAY);
  const [time, setTime] = React.useState<TimePickerValue>({ hour: 14, minute: 30 });

  return (
    <VStack gap="x4" align="center">
      <Box width="358px" maxWidth="100%">
        <DatePicker today={TODAY} value={date} onValueChange={setDate} />
      </Box>
      <Box width="358px" maxWidth="100%">
        <TimePicker value={time} onValueChange={setTime} />
      </Box>
      <Text>
        {date.year}.{date.month}.{date.day}. {String(time.hour).padStart(2, "0")}:
        {String(time.minute).padStart(2, "0")}
      </Text>
    </VStack>
  );
}
