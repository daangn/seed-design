import { TextField, TextFieldTextarea } from "@/registry/ui/text-field";

export default function MultilineTextFieldPreview() {
  return (
    <TextField>
      <TextFieldTextarea autoFocus />
    </TextField>
  );
}
