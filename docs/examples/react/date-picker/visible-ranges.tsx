"use client";

import {
  Box,
  ContinuousDatePicker,
  DatePicker,
  TwoMonthDatePicker,
  VStack,
  WeekDatePicker,
} from "@seed-design/react";
import { SegmentedControl, SegmentedControlItem } from "seed-design/ui/segmented-control";
import * as React from "react";

const today = { year: 2026, month: 7, day: 30 };

const layoutOptions = [
  { value: "month", label: "한 달" },
  { value: "twoMonths", label: "두 달" },
  { value: "week", label: "한 주" },
  { value: "continuous", label: "연속" },
] as const;

type DatePickerLayout = (typeof layoutOptions)[number]["value"];

export default function DatePickerVisibleRanges() {
  const [layout, setLayout] = React.useState<DatePickerLayout>("month");

  const picker = (() => {
    switch (layout) {
      case "twoMonths":
        return <TwoMonthDatePicker today={today} />;
      case "week":
        return <WeekDatePicker today={today} />;
      case "continuous":
        return (
          <ContinuousDatePicker
            today={today}
            yearRange={{ start: 2026, end: 2027 }}
            height="full"
          />
        );
      default:
        return <DatePicker today={today} />;
    }
  })();

  return (
    <VStack gap="x6" width="full" align="center">
      <SegmentedControl
        aria-label="Date Picker 레이아웃"
        value={layout}
        onValueChange={(value) => setLayout(value as DatePickerLayout)}
      >
        {layoutOptions.map((option) => (
          <SegmentedControlItem key={option.value} value={option.value}>
            {option.label}
          </SegmentedControlItem>
        ))}
      </SegmentedControl>
      <Box
        width={layout === "twoMonths" ? "720px" : "358px"}
        height={layout === "continuous" ? "420px" : undefined}
        maxWidth="full"
      >
        {picker}
      </Box>
    </VStack>
  );
}
