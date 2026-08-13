"use client";

import { Box, DatePicker, Text } from "@seed-design/react";

const crowdedDays = new Set([8, 14, 21, 23, 28, 29, 30]);

export default function DatePickerCustomCell() {
  return (
    <Box width="358px" maxWidth="100%">
      <DatePicker
        today={{ year: 2026, month: 2, day: 7 }}
        defaultValue={{ year: 2026, month: 2, day: 9 }}
        renderDateCellSupplement={({ date, isToday }) => {
          const isCrowded = crowdedDays.has(date.day);

          return (
            <Box asChild maxWidth="full">
              <Text
                as="span"
                textStyle="t1Medium"
                color={isToday ? "fg.informative" : isCrowded ? "fg.neutralSubtle" : "fg.positive"}
                maxLines={1}
              >
                {isToday ? "오늘" : isCrowded ? "혼잡" : "여유"}
              </Text>
            </Box>
          );
        }}
      />
    </Box>
  );
}
