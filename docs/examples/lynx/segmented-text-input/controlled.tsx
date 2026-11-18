import "./styles";

import { useState } from "@lynx-js/react";
import { VStack } from "@seed-design/lynx-react";
import { ResidentNumberField } from "@/components/ui/resident-number-field";

export default function Example() {
  const [value, setValue] = useState<string[]>(["", ""]);

  return (
    <VStack className="segmented-text-input-preview" gap="x3">
      <ResidentNumberField label="주민등록번호" value={value} onValueChange={setValue} />
      <text className="segmented-text-input-preview__status">value: {JSON.stringify(value)}</text>
    </VStack>
  );
}
