import { Box } from "@seed-design/react";
import { TimePicker } from "seed-design/ui/time-picker";

export default function TimePickerPreview() {
  return (
    <Box width="358px" maxWidth="100%">
      <TimePicker defaultValue={{ hour: 10, minute: 30 }} />
    </Box>
  );
}
