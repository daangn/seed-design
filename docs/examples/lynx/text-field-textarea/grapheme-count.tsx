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
            label="한 줄 소개"
            description="이모지와 조합 문자를 화면에 보이는 한 글자로 계산합니다."
            maxGraphemeCount={40}
            defaultValue="산책과 커피를 좋아해요 ☕️"
          >
            <TextFieldTextarea
              accessibility-label="한 줄 소개"
              placeholder="자신을 소개해 주세요"
            />
          </TextField>
        </VStack>
      </VStack>
    </page>
  );
}

root.render(<Root />);
