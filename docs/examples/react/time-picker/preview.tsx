import { Box, TimePicker } from "@seed-design/react";

export default function TimePickerPreview() {
  return (
    <Box width="358px" maxWidth="100%">
      <TimePicker defaultValue={{ hour: 10, minute: 30 }} />
    </Box>
  );
}
