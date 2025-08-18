import { HStack } from "@seed-design/react";
import { TextFieldInput } from "seed-design/ui/text-field";

export default function TextFieldInputEnabled() {
  return (
    <HStack width="full" gap="x3">
      <TextFieldInput
        label="라벨"
        description="설명을 써주세요"
        inputProps={{ placeholder: "플레이스홀더" }}
      />
      <TextFieldInput
        label="라벨"
        description="설명을 써주세요"
        invalid
        errorMessage="오류가 발생한 이유를 써주세요"
        inputProps={{ placeholder: "플레이스홀더" }}
      />
    </HStack>
  );
}
