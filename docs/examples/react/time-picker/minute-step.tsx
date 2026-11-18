import { Box } from "@seed-design/react";
import { TimePicker } from "seed-design/ui/time-picker";

export default function TimePickerMinuteStep() {
  return (
    <Box width="358px" maxWidth="100%">
      <TimePicker defaultValue={{ hour: 9, minute: 13 }} minuteStep={5} />
    </Box>
  );
}
