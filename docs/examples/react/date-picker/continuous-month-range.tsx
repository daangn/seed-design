"use client";

import { Box, dateOnOrAfter, dateOnOrBefore } from "@seed-design/react";
import { ContinuousDatePicker } from "seed-design/ui/date-picker";

const today = { year: 2026, month: 12, day: 15 };
const thirtyDaysLater = { year: 2027, month: 1, day: 14 };

export default function ContinuousDatePickerMonthRange() {
  return (
    <Box width="358px" height="420px" maxWidth="full">
      <ContinuousDatePicker
        selectionMode="range"
        today={today}
        yearRange={{ start: 2026, end: 2027 }}
        monthRange={{
          start: { year: today.year, month: today.month },
          end: { year: thirtyDaysLater.year, month: thirtyDaysLater.month },
        }}
        constraints={[dateOnOrAfter(today), dateOnOrBefore(thirtyDaysLater)]}
        height="full"
      />
    </Box>
  );
}
