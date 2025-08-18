import { HStack } from "@seed-design/react";
import { TextFieldInput } from "seed-design/ui/text-field";

export default function TextFieldInputDisabled() {
  return (
    <HStack width="full" gap="x3">
      <TextFieldInput
        label="라벨"
        description="설명을 써주세요"
        disabled
        inputProps={{ placeholder: "플레이스홀더" }}
      />
      <TextFieldInput
        label="라벨"
        description="설명을 써주세요"
        disabled
        invalid
        errorMessage="오류가 발생한 이유를 써주세요"
        inputProps={{ placeholder: "플레이스홀더" }}
      />
    </HStack>
  );
}
