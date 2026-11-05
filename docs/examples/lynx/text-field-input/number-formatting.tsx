import "./styles";

import { useState } from "@lynx-js/react";
import { VStack } from "@seed-design/lynx-react";
import { TextField, TextFieldInput } from "@/components/ui/text-field";

// Lynx JS 런타임에는 `Intl`이 없어 `toLocaleString()`이 구분 기호를 넣지 않으므로 직접 넣습니다.
function formatNumber(value: string) {
  if (value === "") return value;

  const number = Number(value.replace(/,/g, ""));
  if (Number.isNaN(number)) return "";

  const [integer = "", fraction] = String(number).split(".");
  const grouped = integer.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return fraction === undefined ? grouped : `${grouped}.${fraction}`;
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
