import { TextFieldTextarea } from "seed-design/ui/text-field";

export default function MultilineTextFieldConstraints() {
  return (
    <TextFieldTextarea
      textareaProps={{
        placeholder: "플레이스홀더",
        style: { minHeight: "200px", maxHeight: "300px" },
      }}
    />
  );
}
