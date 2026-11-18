import { Box } from "@seed-design/lynx-react";

import { TimePicker } from "@/components/ui/time-picker";

export default function TimePickerMinuteStep() {
  return (
    <Box width="full" maxWidth="358px">
      <TimePicker defaultValue={{ hour: 9, minute: 13 }} minuteStep={5} />
    </Box>
  );
}
