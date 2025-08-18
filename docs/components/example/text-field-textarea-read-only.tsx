import { HStack } from "@seed-design/react";
import { TextFieldTextarea } from "seed-design/ui/text-field";

export default function TextFieldTextareaReadOnly() {
  return (
    <HStack width="full" gap="x3">
      <TextFieldTextarea
        label="라벨"
        description="설명을 써주세요"
        readOnly
        textareaProps={{ placeholder: "플레이스홀더" }}
      />
      <TextFieldTextarea
        label="라벨"
        description="설명을 써주세요"
        readOnly
        invalid
        errorMessage="오류가 발생한 이유를 써주세요"
        textareaProps={{ placeholder: "플레이스홀더" }}
      />
    </HStack>
  );
}
