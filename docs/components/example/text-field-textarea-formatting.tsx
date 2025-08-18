import { useMemo, useState } from "react";
import { TextFieldTextarea } from "seed-design/ui/text-field";

export default function TextFieldTextareaFormatting() {
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
      label="레이블"
      description="공백을 입력할 수 없어요"
      value={formattedValue}
      onValueChange={({ value }) => setValue(value)}
      textareaProps={{ placeholder: "공백을 입력해보세요" }}
    />
  );
}
