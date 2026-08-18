import { root } from "@lynx-js/react";
import { VStack, useSeedClassName } from "@seed-design/lynx-react";
import { TextField, TextFieldInput } from "@/components/ui/text-field";
import "./styles";

function Root() {
  const seedClassName = useSeedClassName({ colorMode: "system" });
  return (
    <page className={seedClassName}>
      <VStack className="text-field-preview text-field-preview__fields" gap="x3">
        <TextField label="라벨" description="설명을 써주세요" readOnly defaultValue="읽기 전용 값">
          <TextFieldInput accessibility-label="라벨" placeholder="플레이스홀더" />
        </TextField>
        <TextField
          label="라벨"
          description="설명을 써주세요"
          readOnly
          invalid
          errorMessage="오류가 발생한 이유를 써주세요"
          defaultValue="읽기 전용 값"
        >
          <TextFieldInput accessibility-label="라벨" />
        </TextField>
        <TextField variant="underline" readOnly defaultValue="읽기 전용 값">
          <TextFieldInput accessibility-label="라벨" />
        </TextField>
      </VStack>
    </page>
  );
}

root.render(<Root />);
