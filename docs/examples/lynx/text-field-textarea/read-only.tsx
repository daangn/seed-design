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
            description="내용을 읽을 수 있지만 수정할 수 없습니다."
            readOnly
            defaultValue={"동네에서 함께 산책할 이웃을 찾고 있어요.\n주말 오후에 주로 산책해요."}
          >
            <TextFieldTextarea accessibility-label="소개" />
          </TextField>
          <TextField label="메모" readOnly>
            <TextFieldTextarea accessibility-label="메모" placeholder="작성된 메모가 없습니다" />
          </TextField>
        </VStack>
      </VStack>
    </page>
  );
}

root.render(<Root />);
