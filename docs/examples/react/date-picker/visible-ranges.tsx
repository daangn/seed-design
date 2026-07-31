import { Box, DatePicker, Text, VStack } from "@seed-design/react";

const today = { year: 2026, month: 7, day: 30 };

export default function DatePickerVisibleRanges() {
  return (
    <VStack gap="x8" width="100%">
      <VStack gap="x2">
        <Text textStyle="t5Bold">Two Months</Text>
        <Box width="720px" maxWidth="100%">
          <DatePicker visibleRange="twoMonths" today={today} />
        </Box>
      </VStack>
      <VStack gap="x2">
        <Text textStyle="t5Bold">Week</Text>
        <Box width="358px" maxWidth="100%">
          <DatePicker visibleRange="week" today={today} />
        </Box>
      </VStack>
      <VStack gap="x2">
        <Text textStyle="t5Bold">Continuous</Text>
        <Box width="358px" height="420px" maxWidth="100%">
          <DatePicker
            visibleRange="continuous"
            today={today}
            yearRange={{ start: 2026, end: 2027 }}
            height="full"
          />
        </Box>
      </VStack>
    </VStack>
  );
}
