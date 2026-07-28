import { Box, TimePicker } from "@seed-design/react";

export default function TimePickerMinuteStep() {
  return (
    <Box width="358px" maxWidth="100%">
      <TimePicker defaultValue={{ hour: 9, minute: 13 }} minuteStep={5} />
    </Box>
  );
}
