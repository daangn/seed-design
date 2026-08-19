import "./styles";

import { root } from "@lynx-js/react";
import { useSeedClassName, VStack } from "@seed-design/lynx-react";
import { TextField, TextFieldTextarea } from "@/components/ui/text-field";

function Root() {
  const seedClassName = useSeedClassName({ colorMode: "system" });

  return (
    <page className={seedClassName}>
      <VStack width="full" height="full" align="center" justify="center">
        <VStack width="full" maxWidth="480px" gap="x3">
          <TextField
            label="소개"
            description="내용이 늘어나면 입력 영역의 높이도 자동으로 늘어납니다."
            defaultValue={"동네에서 함께할 이웃을 찾고 있어요.\n관심사를 자유롭게 적어 주세요."}
          >
            <TextFieldTextarea accessibility-label="소개" placeholder="소개를 입력해 주세요" />
          </TextField>
          <textarea
            className="pure-textarea"
            accessibility-label="Pure textarea"
            placeholder="Pure textarea에 입력해 주세요"
          />
        </VStack>
      </VStack>
    </page>
  );
}

root.render(<Root />);
