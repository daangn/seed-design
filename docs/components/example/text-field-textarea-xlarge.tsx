import { TextFieldTextarea } from "seed-design/ui/text-field";

export default function TextFieldTextareaXlarge() {
  return (
    <TextFieldTextarea
      label="라벨"
      description="설명을 써주세요"
      size="xlarge"
      textareaProps={{ placeholder: "플레이스홀더" }}
    />
  );
}
