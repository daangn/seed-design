import { TextField, TextFieldInput } from "seed-design/ui/text-field";

export default function TextFieldInputPreview() {
  return (
    <TextField
      label="레이블"
      description="Officia in aute cillum non commodo sit dolor occaecat cillum cillum amet mollit."
    >
      <TextFieldInput autoFocus />
    </TextField>
  );
}
