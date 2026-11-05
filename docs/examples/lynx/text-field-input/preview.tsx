import "./styles";

import { TextField, TextFieldInput } from "@/components/ui/text-field";

export default function Example() {
  return (
    <view className="text-field-input-preview">
      <TextField label="라벨">
        <TextFieldInput accessibility-label="라벨" />
      </TextField>
    </view>
  );
}
