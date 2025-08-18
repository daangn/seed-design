import { TextFieldInput } from "seed-design/ui/text-field";

export default function TextFieldInputGraphemeCount() {
  return (
    <TextFieldInput
      label="라벨"
      description="설명을 써주세요"
      maxGraphemeCount={8}
      inputProps={{ placeholder: "플레이스홀더" }}
    />
  );
}
