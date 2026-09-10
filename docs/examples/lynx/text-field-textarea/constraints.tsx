import "./styles";

import { root } from "@lynx-js/react";
import { useSeedClassName, VStack } from "@seed-design/lynx-react";
import { TextField, TextFieldTextarea } from "@/components/ui/text-field";

function Root() {
  const seedClassName = useSeedClassName({ colorMode: "system" });

  return (
    <page className={seedClassName}>
      <VStack width="full" height="full" align="center" justify="center">
        <VStack width="full" maxWidth="480px">
          <TextField label="라벨" description="설명을 써주세요">
            <TextFieldTextarea
              accessibility-label="라벨"
              placeholder="플레이스홀더"
              style={{ minHeight: "200px", maxHeight: "300px" }}
            />
          </TextField>
        </VStack>
      </VStack>
    </page>
  );
}

root.render(<Root />);
