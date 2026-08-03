import { useState } from "@lynx-js/react";
import { KeyboardAvoidingScrollView } from "@seed-design/lynx-react";

import { TextField, TextFieldInput, TextFieldTextarea } from "../seed-design/ui/text-field";

export function TextFieldPage() {
  const [introduction, setIntroduction] = useState("");
  return (
    <KeyboardAvoidingScrollView className="flex flex-col flex-1 px-x4 pb-x10">
      <view className="flex flex-col gap-x6">
        <text className="t8-bold text-fg-neutral">TextField</text>

        <TextField
          label="제목"
          required
          showRequiredIndicator
          name="title"
          description="한 줄 native input 예시입니다."
        >
          <TextFieldInput accessibility-label="제목" placeholder="제목을 입력해 주세요" />
        </TextField>

        <TextField
          label="소개"
          value={introduction}
          maxGraphemeCount={80}
          onValueChange={({ slicedValue }) => setIntroduction(slicedValue)}
          description="내용에 따라 높이가 자동으로 늘어납니다."
        >
          <TextFieldTextarea
            accessibility-label="소개"
            placeholder="여러 줄 소개를 입력해 주세요"
          />
        </TextField>

        <TextField label="비활성화" defaultValue="수정할 수 없는 값" disabled>
          <TextFieldInput accessibility-label="비활성화된 입력" />
        </TextField>
      </view>
    </KeyboardAvoidingScrollView>
  );
}
