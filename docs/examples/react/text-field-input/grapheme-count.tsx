import { TextField, TextFieldInput } from "seed-design/ui/text-field";
import { HStack } from "@seed-design/react";

export default function TextFieldInputGraphemeCount() {
  return (
    <HStack gap="x3" width="full">
      <TextField label="라벨" description="설명을 써주세요" maxGraphemeCount={8}>
        <TextFieldInput placeholder="플레이스홀더" />
      </TextField>
      <TextField
        label="라벨"
        description="설명을 써주세요"
        maxGraphemeCount={8}
        invalid
        errorMessage="에러 메시지"
      >
        <TextFieldInput placeholder="플레이스홀더" />
      </TextField>
    </HStack>
  );
}
