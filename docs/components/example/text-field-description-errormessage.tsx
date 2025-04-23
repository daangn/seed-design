import { HStack } from "@seed-design/react";
import { TextField, TextFieldInput } from "seed-design/ui/text-field";

export default function TextFieldFooterTexts() {
  return (
    <HStack width="full" gap="x3">
      <TextField label="라벨" description="설명을 써주세요" errorMessage="오류가 발생한 이유">
        <TextFieldInput placeholder="valid일 때에는 description이 노출됩니다" />
      </TextField>
      <TextField
        label="라벨"
        description="설명을 써주세요"
        errorMessage="오류가 발생한 이유"
        invalid
      >
        <TextFieldInput placeholder="invalid일 때에는 errorMessage가 노출됩니다" />
      </TextField>
    </HStack>
  );
}
