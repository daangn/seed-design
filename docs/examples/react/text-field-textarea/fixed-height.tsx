import { TextField, TextFieldTextarea } from "seed-design/ui/text-field";

export default function TextFieldTextareaSpecifiedHeight() {
  return (
    <TextField label="라벨" description="설명을 써주세요">
      <TextFieldTextarea placeholder="플레이스홀더" style={{ height: "250px" }} />
    </TextField>
  );
}
