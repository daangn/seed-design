import { Box, DatePicker } from "@seed-design/react";

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
