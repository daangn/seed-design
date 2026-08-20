"use client";

import { Box, Text, VStack } from "@seed-design/react";
import * as React from "react";
import { WheelPicker } from "seed-design/ui/wheel-picker";

const createOptions = (start: number, end: number, suffix: string) =>
  Array.from({ length: end - start + 1 }, (_, index) => {
    const value = String(start + index);
    return { value, label: `${value}${suffix}` };
  });

export default function WheelPickerPreview() {
  const [year, setYear] = React.useState("2026");
  const [month, setMonth] = React.useState("8");
  const [day, setDay] = React.useState("20");

  const columns = [
    {
      id: "year",
      "aria-label": "연도",
      options: createOptions(2020, 2030, "년"),
      value: year,
      onValueChange: setYear,
    },
    {
      id: "month",
      "aria-label": "월",
      options: createOptions(1, 12, "월"),
      value: month,
      onValueChange: setMonth,
      loop: true,
    },
    {
      id: "day",
      "aria-label": "일",
      options: createOptions(1, 31, "일"),
      value: day,
      onValueChange: setDay,
      loop: true,
    },
  ];

  return (
    <VStack width="360px" maxWidth="100%" gap="x3" align="center">
      <Box width="full">
        <WheelPicker aria-label="날짜 선택" columns={columns} />
      </Box>
      <Text aria-live="polite">
        {year}년 {month}월 {day}일
      </Text>
    </VStack>
  );
}
