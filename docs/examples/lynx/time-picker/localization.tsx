import { Box } from "@seed-design/lynx-react";

import { TimePicker } from "@/components/ui/time-picker";

export default function TimePickerLocalization() {
  return (
    <Box width="full" maxWidth="358px">
      <TimePicker
        locale="en-US"
        periodAccessibilityLabel="AM/PM"
        hourAccessibilityLabel="Hour"
        minuteAccessibilityLabel="Minute"
        defaultValue={{ hour: 13, minute: 30 }}
      />
    </Box>
  );
}
