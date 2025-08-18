import { TextFieldInput } from "seed-design/ui/text-field";

export default function TextFieldInputLarge() {
  return (
    <TextFieldInput
      label="라벨"
      description="설명을 써주세요"
      size="large"
      inputProps={{ placeholder: "플레이스홀더" }}
    />
  );
}
