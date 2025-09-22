import { FieldRequiredIndicator } from "@/registry/ui/field";
import { HStack } from "@seed-design/react";
import { TextField, TextFieldInput } from "seed-design/ui/text-field";

export default function TextFieldInputIndicator() {
  return (
    <HStack gap="x3" width="full">
      <TextField label="라벨" description="설명을 써주세요" indicator="(선택)">
        <TextFieldInput placeholder="플레이스홀더" />
      </TextField>
      <TextField label="라벨" description="설명을 써주세요" indicator={<FieldRequiredIndicator />}>
        <TextFieldInput placeholder="플레이스홀더" />
      </TextField>
    </HStack>
  );
}
