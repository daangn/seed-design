import "./styles";

import IconWonLine from "@karrotmarket/lynx-monochrome-icon/IconWonLine";

import { VStack } from "@seed-design/lynx-react";
import { TextField, TextFieldInput } from "@/components/ui/text-field";

export default function Example() {
  return (
    <VStack className="text-field-input-preview__content" gap="spacingY.componentDefault">
      <TextField label="너비" description="직접 측정 후 입력해주세요." suffix="cm">
        <TextFieldInput accessibility-label="너비" placeholder="200" />
      </TextField>
      <TextField label="금액" description="단위: 원" suffixIcon={<IconWonLine />}>
        <TextFieldInput accessibility-label="금액" placeholder="50,000" />
      </TextField>
      <TextField variant="underline" description="직접 측정 후 입력해주세요." suffix="cm">
        <TextFieldInput accessibility-label="너비" placeholder="200" />
      </TextField>
      <TextField variant="underline" description="단위: 원" suffixIcon={<IconWonLine />}>
        <TextFieldInput accessibility-label="금액" placeholder="50,000" />
      </TextField>
    </VStack>
  );
}
