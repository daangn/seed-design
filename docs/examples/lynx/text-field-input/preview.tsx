import "./styles";

import { root } from "@lynx-js/react";
import { VStack, useSeedClassName } from "@seed-design/lynx-react";
import { TextField, TextFieldInput } from "@/components/ui/text-field";

function Root() {
  const seedClassName = useSeedClassName({ colorMode: "system" });

  return (
    <page className={seedClassName}>
      <VStack className="text-field-input-preview">
        <VStack className="text-field-input-preview__content">
          <TextField label="라벨">
            <TextFieldInput accessibility-label="라벨" />
          </TextField>
        </VStack>
      </VStack>
    </page>
  );
}

root.render(<Root />);
