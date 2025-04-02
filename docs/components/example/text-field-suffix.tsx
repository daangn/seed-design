import { IconWonLine } from "@karrotmarket/react-monochrome-icon";
import { Column, Columns } from "@seed-design/react";
import { TextField, TextFieldInput } from "seed-design/ui/text-field";

export default function TextFieldSuffix() {
  return (
    <Columns width="full" gap="x3">
      <Column>
        <TextField label="라벨" description="설명을 써주세요" suffix="cm">
          <TextFieldInput placeholder="플레이스홀더" />
        </TextField>
      </Column>
      <Column>
        <TextField label="라벨" description="설명을 써주세요" suffixIcon={<IconWonLine />}>
          <TextFieldInput placeholder="플레이스홀더" />
        </TextField>
      </Column>
    </Columns>
  );
}
