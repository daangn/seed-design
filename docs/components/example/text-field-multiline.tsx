import { TextField, TextFieldTextarea } from "seed-design/ui/text-field";

export default function TextFieldMultiline() {
  return (
    <TextField label="Multiline" description="설명을 써주세요" maxGraphemeCount={100}>
      <TextFieldTextarea />
    </TextField>
  );
}
