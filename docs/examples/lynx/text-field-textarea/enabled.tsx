import "./styles";

import { root } from "@lynx-js/react";
import { useSeedClassName, VStack } from "@seed-design/lynx-react";
import { TextField, TextFieldTextarea } from "@/components/ui/text-field";

function Root() {
  const seedClassName = useSeedClassName({ colorMode: "system" });

  return (
    <page className={seedClassName}>
      <VStack width="full" height="full" align="center" justify="center">
        <VStack width="full" maxWidth="480px" gap="x5">
          <TextField label="소개" description="자신을 소개해 주세요.">
            <TextFieldTextarea accessibility-label="소개" placeholder="소개를 입력해 주세요" />
          </TextField>
          <TextField
            label="문의 내용"
            invalid
            errorMessage="문의 내용을 10자 이상 입력해 주세요."
            defaultValue="짧은 문의"
          >
            <TextFieldTextarea accessibility-label="문의 내용" />
          </TextField>
        </VStack>
      </VStack>
    </page>
  );
}

root.render(<Root />);
