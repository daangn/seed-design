import { TextField, TextFieldInput } from "seed-design/ui/text-field";
import { FieldRequiredIndicator } from "seed-design/ui/field";

export default function TextFieldInputPreview() {
  return (
    <TextField
      label="레이블"
      indicator={<FieldRequiredIndicator />}
      description="Officia in aute cillum non commodo sit dolor occaecat cillum cillum amet mollit."
    >
      <TextFieldInput autoFocus />
    </TextField>
  );
}
