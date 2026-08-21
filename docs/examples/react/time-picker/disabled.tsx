import { Box, TimePicker } from "@seed-design/react";

export default function TimePickerDisabled() {
  return (
    <Box width="358px" maxWidth="100%">
      <TimePicker disabled defaultValue={{ hour: 10, minute: 30 }} />
    </Box>
  );
}
