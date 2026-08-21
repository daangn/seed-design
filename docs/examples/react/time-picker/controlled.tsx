"use client";

import { Box, Text, TimePicker, VStack, type TimePickerValue } from "@seed-design/react";
import * as React from "react";

export default function TimePickerControlled() {
  const [value, setValue] = React.useState<TimePickerValue>({ hour: 10, minute: 30 });

  return (
    <VStack gap="x3" align="center">
      <Box width="358px" maxWidth="100%">
        <TimePicker value={value} onValueChange={setValue} />
      </Box>
      <Text>
        {String(value.hour).padStart(2, "0")}:{String(value.minute).padStart(2, "0")}
      </Text>
    </VStack>
  );
}
