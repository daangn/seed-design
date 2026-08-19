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
          <TextField
            label="소개"
            description="현재 수정할 수 없는 항목입니다."
            disabled
            defaultValue="동네 생활을 좋아해요."
          >
            <TextFieldTextarea accessibility-label="소개" />
          </TextField>
          <TextField
            label="문의 내용"
            disabled
            invalid
            errorMessage="입력 내용을 확인해 주세요."
            defaultValue="확인이 필요한 내용"
          >
            <TextFieldTextarea accessibility-label="문의 내용" />
          </TextField>
        </VStack>
      </VStack>
    </page>
  );
}

root.render(<Root />);
