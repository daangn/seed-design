import { useMemo, useState } from "react";
import { TextField, TextFieldInput } from "seed-design/ui/text-field";

export default function TextFieldInputNumberFormatting() {
  const [value, setValue] = useState("1000");

  const formattedValue = useMemo(() => {
    if (value === "") return value;

    const number = Number(value.replace(/,/g, ""));
    if (Number.isNaN(number)) return "";

    return number.toLocaleString();
  }, [value]);

  return (
    <TextField
      label="금액"
      description="금액을 써주세요"
      value={formattedValue}
      onValueChange={({ value }) => setValue(value)}
    >
      <TextFieldInput placeholder="9,999,999" />
    </TextField>
  );
}
