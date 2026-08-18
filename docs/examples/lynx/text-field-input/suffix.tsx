import { root } from "@lynx-js/react";
import IconWonLine from "@karrotmarket/lynx-monochrome-icon/IconWonLine";
import { VStack, useSeedClassName } from "@seed-design/lynx-react";
import { TextField, TextFieldInput } from "@/components/ui/text-field";
import "./styles";

function Root() {
  const seedClassName = useSeedClassName({ colorMode: "system" });
  return (
    <page className={seedClassName}>
      <VStack className="text-field-preview text-field-preview__fields" gap="x3">
        <TextField label="너비" description="직접 측정 후 입력해주세요." suffix="cm">
          <TextFieldInput accessibility-label="너비" placeholder="200" />
        </TextField>
        <TextField label="금액" description="단위: 원" suffixIcon={<IconWonLine />}>
          <TextFieldInput accessibility-label="금액" placeholder="50,000" />
        </TextField>
      </VStack>
    </page>
  );
}

root.render(<Root />);
