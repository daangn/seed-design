import "./styles";

import { useState } from "@lynx-js/react";
import { VStack } from "@seed-design/lynx-react";
import { TextField, TextFieldInput } from "@/components/ui/text-field";

function formatNumber(value: string) {
  if (value === "") return value;

  const number = Number(value.replace(/,/g, ""));
  if (Number.isNaN(number)) return "";

  return number.toLocaleString();
}

export default function Example() {
  const [value, setValue] = useState("1000");
  const formattedValue = formatNumber(value);

  return (
    <VStack className="text-field-input-preview__content">
      <TextField
        label="금액"
        description="금액을 써주세요"
        value={formattedValue}
        onValueChange={({ value: nextValue }) => setValue(nextValue)}
      >
        <TextFieldInput accessibility-label="금액" placeholder="9,999,999" />
      </TextField>
    </VStack>
  );
}
