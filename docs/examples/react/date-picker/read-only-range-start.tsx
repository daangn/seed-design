"use client";

import {
  Box,
  DatePicker,
  Text,
  VStack,
  dateOnOrAfter,
  type DatePickerRangeValue,
} from "@seed-design/react";
import * as React from "react";

const today = { year: 2026, month: 8, day: 10 } as const;

const initialValue: DatePickerRangeValue = {
  start: { year: 2026, month: 8, day: 7 },
  end: { year: 2026, month: 8, day: 14 },
};

function formatDate(date: DatePickerRangeValue["start"]) {
  return `${date.year}.${date.month}.${date.day}`;
}

export default function DatePickerReadOnlyRangeStart() {
  const [value, setValue] = React.useState(initialValue);

  return (
    <VStack gap="x3" align="center">
      <Box width="358px" maxWidth="100%">
        <DatePicker
          selectionMode="range"
          rangeStartReadOnly
          today={today}
          constraints={[dateOnOrAfter(today)]}
          value={value}
          onValueChange={setValue}
        />
      </Box>
      <Text>
        광고 기간 {formatDate(value.start)}
        {value.end ? ` ~ ${formatDate(value.end)}` : ""}
      </Text>
    </VStack>
  );
}
