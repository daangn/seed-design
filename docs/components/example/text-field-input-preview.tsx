import { TextFieldInput } from "seed-design/ui/text-field";

export default function TextFieldInputPreview() {
  return (
    <TextFieldInput
      label="레이블"
      description="Officia in aute cillum non commodo sit dolor occaecat cillum cillum amet mollit."
      inputProps={{ autoFocus: true }}
      maxGraphemeCount={100}
    />
  );
}
