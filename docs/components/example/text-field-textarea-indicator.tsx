import { TextFieldTextarea } from "seed-design/ui/text-field";

export default function TextFieldTextareaIndicator() {
  return (
    <TextFieldTextarea
      label="라벨"
      description="설명을 써주세요"
      indicator="(선택)"
      textareaProps={{ placeholder: "플레이스홀더" }}
    />
  );
}
