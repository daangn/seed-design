import { TextField, TextFieldInput } from "seed-design/ui/text-field";
import { IconMagnifyingglassLine } from "@daangn/react-monochrome-icon";
import { Columns, Column } from "@seed-design/react";

export default function TextFieldPrefix() {
  return (
    <Columns width="full" gap="x3">
      <Column>
        <TextField label="라벨" description="설명을 써주세요" prefix="https://">
          <TextFieldInput placeholder="플레이스홀더" />
        </TextField>
      </Column>
      <Column>
        <TextField
          label="라벨"
          description="설명을 써주세요"
          prefixIcon={<IconMagnifyingglassLine />}
        >
          <TextFieldInput placeholder="플레이스홀더" />
        </TextField>
      </Column>
    </Columns>
  );
}
