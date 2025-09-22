import { TextField, TextFieldTextarea } from "seed-design/ui/text-field";

export default function MultilineTextFieldXlarge() {
  return (
    <TextField label="라벨" description="설명을 써주세요" size="xlarge">
      <TextFieldTextarea placeholder="플레이스홀더" />
    </TextField>
  );
}
