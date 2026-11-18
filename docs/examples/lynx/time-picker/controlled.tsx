import * as React from "@lynx-js/react";
import { Box, Text, type TimePickerValue, VStack } from "@seed-design/lynx-react";

import { TimePicker } from "@/components/ui/time-picker";

export default function TimePickerControlled() {
  const [value, setValue] = React.useState<TimePickerValue>({ hour: 10, minute: 30 });

  return (
    <VStack width="full" gap="x3" align="center">
      <Box width="full" maxWidth="358px">
        <TimePicker value={value} onValueChange={setValue} />
      </Box>
      <Text>
        {String(value.hour).padStart(2, "0")}:{String(value.minute).padStart(2, "0")}
      </Text>
    </VStack>
  );
}
