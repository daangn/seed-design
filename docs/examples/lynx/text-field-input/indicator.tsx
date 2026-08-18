import { root } from "@lynx-js/react";
import { VStack, useSeedClassName } from "@seed-design/lynx-react";
import { TextField, TextFieldInput } from "@/components/ui/text-field";
import "./styles";

function Root() {
  const seedClassName = useSeedClassName({ colorMode: "system" });
  return (
    <page className={seedClassName}>
      <VStack className="text-field-preview text-field-preview__fields" gap="x3">
        <TextField
          label="선택 필드"
          labelWeight="bold"
          description="설명을 써주세요"
          indicator="선택"
        >
          <TextFieldInput accessibility-label="선택 필드" placeholder="플레이스홀더" />
        </TextField>
        <TextField label="필수 필드" description="설명을 써주세요" required showRequiredIndicator>
          <TextFieldInput accessibility-label="필수 필드" placeholder="플레이스홀더" />
        </TextField>
      </VStack>
    </page>
  );
}

root.render(<Root />);
