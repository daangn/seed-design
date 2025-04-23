import { VStack } from "@seed-design/react";
import { TextField, TextFieldInput } from "seed-design/ui/text-field";

export default function TextFieldSizes() {
  return (
    <VStack gap="x3">
      <TextField label="라벨" description="설명을 써주세요" size="large">
        <TextFieldInput placeholder="size (large)" />
      </TextField>
      <TextField label="라벨" description="설명을 써주세요" size="medium">
        <TextFieldInput placeholder="size (medium)" />
      </TextField>
    </VStack>
  );
}
