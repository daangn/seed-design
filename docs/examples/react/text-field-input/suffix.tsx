import { IconWonLine } from "@karrotmarket/react-monochrome-icon";
import { HStack, VStack } from "@seed-design/react";
import { TextField, TextFieldInput } from "seed-design/ui/text-field";

export default function TextFieldInputSuffix() {
  return (
    <VStack width="full" gap="spacingY.componentDefault">
      <HStack gap="x3">
        <TextField label="너비" description="직접 측정 후 입력해주세요." suffix="cm">
          <TextFieldInput placeholder="200" />
        </TextField>
        <TextField label="금액" description="단위: 원" suffixIcon={<IconWonLine />}>
          <TextFieldInput placeholder="50,000" />
        </TextField>
      </HStack>
      <HStack gap="x3">
        <TextField variant="underline" description="직접 측정 후 입력해주세요." suffix="cm">
          <TextFieldInput aria-label="너비" placeholder="200" />
        </TextField>
        <TextField variant="underline" description="단위: 원" suffixIcon={<IconWonLine />}>
          <TextFieldInput aria-label="금액" placeholder="50,000" />
        </TextField>
      </HStack>
    </VStack>
  );
}
