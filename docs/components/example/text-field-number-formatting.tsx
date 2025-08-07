import { useMemo, useState } from "react";
import { TextFieldInput } from "seed-design/ui/text-field";

export default function TextFieldNumberFormatting() {
  const [value, setValue] = useState("1000");

  const formattedValue = useMemo(() => {
    if (value === "") return value;

    const number = Number(value.replace(/,/g, ""));
    if (Number.isNaN(number)) return "";

    return number.toLocaleString();
  }, [value]);

  return (
    <TextFieldInput
      inputProps={{ placeholder: "9,999,999" }}
      value={formattedValue}
      onValueChange={(value) => setValue(value)}
    />
  );
}
