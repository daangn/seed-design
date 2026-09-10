import "./styles";

import { root } from "@lynx-js/react";
import { useSeedClassName, VStack } from "@seed-design/lynx-react";
import { TextField, TextFieldTextarea } from "@/components/ui/text-field";

function Root() {
  const seedClassName = useSeedClassName({ colorMode: "system" });

  return (
    <page className={seedClassName}>
      <VStack width="full" height="full" align="center" justify="center">
        <VStack width="full" maxWidth="480px" gap="spacingY.componentDefault">
          <TextField
            label="선택 필드"
            labelWeight="bold"
            description="설명을 써주세요"
            indicator="선택"
          >
            <TextFieldTextarea accessibility-label="선택 필드" placeholder="플레이스홀더" />
          </TextField>
          <TextField label="필수 필드" description="설명을 써주세요" required>
            <TextFieldTextarea accessibility-label="필수 필드" placeholder="플레이스홀더" />
          </TextField>
          <TextField label="필수 필드" description="설명을 써주세요" required showRequiredIndicator>
            <TextFieldTextarea accessibility-label="필수 필드" placeholder="플레이스홀더" />
          </TextField>
        </VStack>
      </VStack>
    </page>
  );
}

root.render(<Root />);
