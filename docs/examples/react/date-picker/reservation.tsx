"use client";

import {
  Box,
  DatePicker,
  Text,
  VStack,
  excludeDates,
  rangeDayCountAtLeast,
  rangeDayCountAtMost,
  type DatePickerDate,
  type DatePickerRangeValue,
} from "@seed-design/react";
import * as React from "react";

const bookedDateKeys = new Set(["2026-07-18", "2026-07-19", "2026-07-25"]);

function toDateKey(date: DatePickerDate) {
  return `${date.year}-${String(date.month).padStart(2, "0")}-${String(date.day).padStart(2, "0")}`;
}

const constraints = [
  rangeDayCountAtLeast(2),
  rangeDayCountAtMost(14),
  excludeDates((date) => bookedDateKeys.has(toDateKey(date))),
];

export default function DatePickerReservation() {
  const [value, setValue] = React.useState<DatePickerRangeValue>({
    start: { year: 2026, month: 7, day: 10 },
  });

  return (
    <VStack gap="x3" align="center">
      <Box width="358px" maxWidth="100%">
        <DatePicker
          selectionMode="range"
          visibleRange="twoMonths"
          today={{ year: 2026, month: 7, day: 1 }}
          value={value}
          onValueChange={setValue}
          constraints={constraints}
          aria-label="체크인 및 체크아웃 날짜"
        />
      </Box>
      <Text>
        체크인 {toDateKey(value.start)}
        {value.end ? ` · 체크아웃 ${toDateKey(value.end)}` : " · 체크아웃을 선택하세요"}
      </Text>
    </VStack>
  );
}
