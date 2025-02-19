import { TextField, TextFieldInput } from "seed-design/ui/text-field";
import { Columns, Column } from "@seed-design/react";

export default function TextFieldReadOnly() {
  return (
    <Columns width="full" gap="x3">
      <Column>
        <TextField label="라벨" description="설명을 써주세요" readOnly>
          <TextFieldInput placeholder="플레이스홀더" />
        </TextField>
      </Column>
      <Column>
        <TextField
          label="라벨"
          description="설명을 써주세요"
          readOnly
          invalid
          errorMessage="오류가 발생한 이유를 써주세요"
        >
          <TextFieldInput placeholder="플레이스홀더" />
        </TextField>
      </Column>
    </Columns>
  );
}
