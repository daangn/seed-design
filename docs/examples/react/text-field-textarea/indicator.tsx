import { HStack } from "@seed-design/react";
import { TextField, TextFieldTextarea } from "seed-design/ui/text-field";

export default function TextFieldTextareaIndicator() {
  return (
    <HStack gap="x3" width="full">
      <TextField
        label="선택 필드"
        labelWeight="bold"
        description="설명을 써주세요"
        indicator="선택"
      >
        <TextFieldTextarea placeholder="플레이스홀더" />
      </TextField>
      <TextField label="필수 필드" description="설명을 써주세요" required>
        <TextFieldTextarea placeholder="플레이스홀더" />
      </TextField>
      <TextField label="필수 필드" description="설명을 써주세요" required showRequiredIndicator>
        <TextFieldTextarea placeholder="플레이스홀더" />
      </TextField>
    </HStack>
  );
}
