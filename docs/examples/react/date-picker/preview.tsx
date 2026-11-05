import { Box } from "@seed-design/react";
import { DatePicker } from "seed-design/ui/date-picker";

export default function DatePickerPreview() {
  return (
    <Box width="358px" maxWidth="100%">
      <DatePicker
        today={{ year: 2026, month: 7, day: 30 }}
        defaultValue={{ year: 2026, month: 7, day: 30 }}
      />
    </Box>
  );
}
