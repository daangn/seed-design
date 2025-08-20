import { TextField, TextFieldTextarea } from "seed-design/ui/text-field";

export default function TextFieldTextareaPreview() {
  return (
    <TextField
      label="레이블"
      description="Officia in aute cillum non commodo sit dolor occaecat cillum cillum amet mollit."
    >
      <TextFieldTextarea autoFocus />
    </TextField>
  );
}
