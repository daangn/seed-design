import { useState } from "react";
import { TextFieldTextarea } from "seed-design/ui/text-field";

export default function TextFieldTextareaSlicing() {
  const [value, setValue] = useState("");

  return (
    <TextFieldTextarea
      label="라벨"
      description="6글자까지 입력 가능합니다"
      maxGraphemeCount={6}
      value={value}
      onValueChange={({ slicedValue }) => setValue(slicedValue)}
      textareaProps={{ placeholder: "플레이스홀더" }}
    />
  );
}
