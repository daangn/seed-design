import "./styles";

import { root } from "@lynx-js/react";
import { useSeedClassName, VStack } from "@seed-design/lynx-react";
import { TextField, TextFieldInput } from "@/components/ui/text-field";

function Root() {
  const seedClassName = useSeedClassName({ colorMode: "system" });

  return (
    <page className={seedClassName}>
      <VStack className="text-field-input-preview">
        <VStack className="text-field-input-preview__content">
          <TextField
            label="라벨"
            description="설명을 써주세요"
            defaultValue="수정할 수 없는 값"
            readOnly
          >
            <TextFieldInput accessibility-label="라벨" />
          </TextField>
        </VStack>
      </VStack>
    </page>
  );
}

root.render(<Root />);
