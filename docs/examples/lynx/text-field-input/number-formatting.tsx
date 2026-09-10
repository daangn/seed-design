import "./styles";

import { root, useState } from "@lynx-js/react";
import { useSeedClassName, VStack } from "@seed-design/lynx-react";
import { TextField, TextFieldInput } from "@/components/ui/text-field";

function formatNumber(value: string) {
  const digits = value.replace(/\D/g, "");
  return digits.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function Root() {
  const seedClassName = useSeedClassName({ colorMode: "system" });
  const [value, setValue] = useState("1,000");

  return (
    <page className={seedClassName}>
      <VStack className="text-field-input-preview">
        <VStack className="text-field-input-preview__content">
          <TextField
            label="금액"
            description="금액을 써주세요"
            value={value}
            onValueChange={({ value: nextValue }) => setValue(formatNumber(nextValue))}
          >
            <TextFieldInput accessibility-label="금액" placeholder="9,999,999" />
          </TextField>
        </VStack>
      </VStack>
    </page>
  );
}

root.render(<Root />);
