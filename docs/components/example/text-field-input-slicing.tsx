import { useState } from "react";
import { TextFieldInput } from "seed-design/ui/text-field";

export default function TextFieldInputSlicing() {
  const [value, setValue] = useState("");

  return (
    <TextFieldInput
      label="라벨"
      description="6글자까지 입력 가능합니다"
      maxGraphemeCount={6}
      value={value}
      onValueChange={({ slicedValue }) => setValue(slicedValue)}
      inputProps={{ placeholder: "플레이스홀더" }}
    />
  );
}
