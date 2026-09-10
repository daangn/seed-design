import "./styles";

import { root } from "@lynx-js/react";
import { useSeedClassName, VStack } from "@seed-design/lynx-react";
import { TextField, TextFieldInput } from "@/components/ui/text-field";

function Root() {
  const seedClassName = useSeedClassName({ colorMode: "system" });

  return (
    <page className={seedClassName}>
      <VStack className="text-field-input-preview">
        <VStack className="text-field-input-preview__content" gap="spacingY.componentDefault">
          <TextField label="라벨" description="설명을 써주세요" maxGraphemeCount={8}>
            <TextFieldInput accessibility-label="라벨" placeholder="플레이스홀더" />
          </TextField>
          <TextField
            label="라벨"
            description="설명을 써주세요"
            maxGraphemeCount={8}
            invalid
            errorMessage="에러 메시지"
          >
            <TextFieldInput accessibility-label="라벨" placeholder="플레이스홀더" />
          </TextField>
        </VStack>
      </VStack>
    </page>
  );
}

root.render(<Root />);
