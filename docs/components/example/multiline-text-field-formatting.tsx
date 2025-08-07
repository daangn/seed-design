import { useMemo, useState } from "react";
import { TextFieldTextarea } from "seed-design/ui/text-field";

export default function MultilineTextFieldFormatting() {
  const [value, setValue] = useState("");

  const formattedValue = useMemo(
    () =>
      value
        .split("")
        .filter((char) => char !== " ")
        .join(""),
    [value],
  );

  return (
    <TextFieldTextarea
      value={formattedValue}
      onValueChange={(value) => setValue(value)}
      textareaProps={{ placeholder: "공백을 입력해보세요" }}
    />
  );
}
