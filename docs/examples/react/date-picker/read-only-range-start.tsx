"use client";

import { Box, DatePicker, Text, VStack, type DatePickerRangeValue } from "@seed-design/react";
import * as React from "react";

const initialValue: DatePickerRangeValue = {
  start: { year: 2026, month: 8, day: 7 },
  end: { year: 2026, month: 8, day: 9 },
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
          today={{ year: 2026, month: 8, day: 8 }}
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
