import "./styles";

import { root, useState } from "@lynx-js/react";
import { useSeedClassName, VStack } from "@seed-design/lynx-react";
import { TextField, TextFieldInput } from "@/components/ui/text-field";

function Root() {
  const seedClassName = useSeedClassName({ colorMode: "system" });
  const [value, setValue] = useState("");

  return (
    <page className={seedClassName}>
      <VStack className="text-field-input-preview">
        <VStack className="text-field-input-preview__content">
          <TextField
            label="라벨"
            description="6글자까지 입력 가능합니다"
            maxGraphemeCount={6}
            value={value}
            onValueChange={({ slicedValue }) => setValue(slicedValue)}
          >
            <TextFieldInput accessibility-label="라벨" placeholder="플레이스홀더" />
          </TextField>
        </VStack>
      </VStack>
    </page>
  );
}

root.render(<Root />);
