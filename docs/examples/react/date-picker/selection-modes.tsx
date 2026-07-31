"use client";

import {
  Box,
  DatePicker,
  Text,
  VStack,
  type DatePickerDate,
  type DatePickerRangeValue,
} from "@seed-design/react";
import * as React from "react";

const today = { year: 2026, month: 7, day: 30 };

export default function DatePickerSelectionModes() {
  const [single, setSingle] = React.useState<DatePickerDate>(today);
  const [range, setRange] = React.useState<DatePickerRangeValue>({
    start: { year: 2026, month: 7, day: 10 },
    end: { year: 2026, month: 7, day: 13 },
  });
  const [multiple, setMultiple] = React.useState<DatePickerDate[]>([
    { year: 2026, month: 7, day: 7 },
    { year: 2026, month: 7, day: 14 },
  ]);

  return (
    <VStack gap="x8" align="center">
      <VStack gap="x2" align="center">
        <Text textStyle="t5Bold">Single</Text>
        <Box width="358px" maxWidth="100%">
          <DatePicker today={today} value={single} onValueChange={setSingle} />
        </Box>
      </VStack>
      <VStack gap="x2" align="center">
        <Text textStyle="t5Bold">Range</Text>
        <Box width="358px" maxWidth="100%">
          <DatePicker selectionMode="range" today={today} value={range} onValueChange={setRange} />
        </Box>
      </VStack>
      <VStack gap="x2" align="center">
        <Text textStyle="t5Bold">Multiple</Text>
        <Box width="358px" maxWidth="100%">
          <DatePicker
            selectionMode="multiple"
            today={today}
            value={multiple}
            onValueChange={setMultiple}
          />
        </Box>
      </VStack>
    </VStack>
  );
}
