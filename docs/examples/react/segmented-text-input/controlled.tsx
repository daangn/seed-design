import { useState } from "react";
import { Text, VStack } from "@seed-design/react";
import { ResidentNumberField } from "seed-design/ui/resident-number-field";

export default function SegmentedTextInputControlled() {
  const [value, setValue] = useState<string[]>(["", ""]);

  return (
    <VStack width="358px" maxWidth="100%" gap="x3">
      <ResidentNumberField label="주민등록번호" value={value} onValueChange={setValue} />
      <Text textStyle="t4Regular" color="fg.neutralMuted">
        value: {JSON.stringify(value)}
      </Text>
    </VStack>
  );
}
