import { root } from "@lynx-js/react";
import { VStack, useSeedClassName } from "@seed-design/lynx-react";
import { TextField, TextFieldInput } from "@/components/ui/text-field";
import "./styles";

function Root() {
  const seedClassName = useSeedClassName({ colorMode: "system" });
  return (
    <page className={seedClassName}>
      <VStack className="text-field-preview text-field-preview__fields" gap="x3">
        <TextField label="라벨" description="설명을 써주세요" maxGraphemeCount={8}>
          <TextFieldInput accessibility-label="라벨" placeholder="플레이스홀더" />
        </TextField>
        <TextField label="라벨" maxGraphemeCount={8} invalid errorMessage="에러 메시지">
          <TextFieldInput accessibility-label="라벨" placeholder="플레이스홀더" />
        </TextField>
      </VStack>
    </page>
  );
}

root.render(<Root />);
