import { Box } from "@seed-design/lynx-react";

import { TimePicker } from "@/components/ui/time-picker";

export default function TimePickerPreview() {
  return (
    <Box width="full" maxWidth="358px">
      <TimePicker defaultValue={{ hour: 10, minute: 30 }} />
    </Box>
  );
}
