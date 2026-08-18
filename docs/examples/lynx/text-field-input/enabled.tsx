import { root } from "@lynx-js/react";
import { VStack, useSeedClassName } from "@seed-design/lynx-react";
import { TextField, TextFieldInput } from "@/components/ui/text-field";
import "./styles";

function Root() {
  const seedClassName = useSeedClassName({ colorMode: "system" });
  return (
    <page className={seedClassName}>
      <VStack className="text-field-preview text-field-preview__fields" gap="x3">
        <TextField label="라벨" description="설명을 써주세요">
          <TextFieldInput accessibility-label="라벨" placeholder="플레이스홀더" />
        </TextField>
        <TextField
          label="라벨"
          description="설명을 써주세요"
          invalid
          errorMessage="오류가 발생한 이유를 써주세요"
        >
          <TextFieldInput accessibility-label="라벨" placeholder="플레이스홀더" />
        </TextField>
        <TextField variant="underline" description="설명을 써주세요">
          <TextFieldInput accessibility-label="라벨" placeholder="플레이스홀더" />
        </TextField>
      </VStack>
    </page>
  );
}

root.render(<Root />);
