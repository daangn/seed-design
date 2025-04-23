import { TextField, TextFieldInput } from "seed-design/ui/text-field";

export default function TextFieldDisabled() {
  return (
    <TextField label="라벨" description="설명을 써주세요" disabled>
      <TextFieldInput placeholder="플레이스홀더" />
    </TextField>
  );
}
