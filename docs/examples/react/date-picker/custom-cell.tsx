import { Box, DatePicker, Text } from "@seed-design/react";

const prices = new Map([
  [10, "12만원"],
  [11, "9만원"],
  [12, "11만원"],
  [13, "마감"],
  [14, "8만원"],
]);

export default function DatePickerCustomCell() {
  return (
    <Box width="358px" maxWidth="100%">
      <DatePicker
        today={{ year: 2026, month: 7, day: 1 }}
        renderDateCellSupplement={({ date, isUnavailable }) => (
          <Box asChild maxWidth="full">
            <Text as="span" textStyle="t1Regular" color="fg.neutralMuted" maxLines={1}>
              {isUnavailable ? "선택 불가" : (prices.get(date.day) ?? "예약 가능")}
            </Text>
          </Box>
        )}
        constraints={[(date) => date.day !== 13]}
      />
    </Box>
  );
}
