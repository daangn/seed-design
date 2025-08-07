import { TextFieldTextarea } from "seed-design/ui/text-field";

export default function MultilineTextFieldSpecifiedHeight() {
  return (
    <TextFieldTextarea
      textareaProps={{ placeholder: "플레이스홀더", style: { height: "250px" } }}
    />
  );
}
