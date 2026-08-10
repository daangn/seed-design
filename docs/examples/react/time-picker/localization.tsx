import { Box, TimePicker } from "@seed-design/react";

export default function TimePickerLocalization() {
  return (
    <Box width="358px" maxWidth="100%">
      <TimePicker
        locale="en-US"
        aria-label="Select time"
        periodAriaLabel="AM/PM"
        hourAriaLabel="Hour"
        minuteAriaLabel="Minute"
        defaultValue={{ hour: 13, minute: 30 }}
      />
    </Box>
  );
}
