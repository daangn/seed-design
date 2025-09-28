import { TextField, TextFieldTextarea } from "seed-design/ui/text-field";

export default function MultilineTextFieldPreview() {
  return (
    <TextField label="라벨">
      <TextFieldTextarea autoFocus />
    </TextField>
  );
}
