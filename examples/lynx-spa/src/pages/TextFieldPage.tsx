import { useState } from "@lynx-js/react";
import { KeyboardAvoidingScrollView } from "@seed-design/lynx-react";

import { Checkbox } from "../seed-design/ui/checkbox";
import {
  TextField,
  type TextFieldProps,
  TextFieldInput,
  TextFieldTextarea,
} from "../seed-design/ui/text-field";

export function TextFieldPage() {
  const [introduction, setIntroduction] = useState("소개 입력 예시 (반가워요)");
  const [comparisonValue, setComparisonValue] = useState("제목 입력 예시");
  const [isComparisonOverlapped, setIsComparisonOverlapped] = useState(false);

  const handleComparisonValueChange: NonNullable<TextFieldProps["onValueChange"]> = ({
    slicedValue,
  }) => {
    "background only";
    setComparisonValue(slicedValue);
  };

  const handleComparisonOverlapChange = (checked: boolean) => {
    "background only";
    setIsComparisonOverlapped(checked);
  };

  const comparisonFieldClassName = isComparisonOverlapped
    ? "absolute top-0 right-0 bottom-0 left-0 opacity-50"
    : "flex-1 min-w-0";

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

        <view className="flex flex-col gap-x3">
          <text className="t5-bold text-fg-neutral">활성화/비활성화 레이아웃 비교</text>

          <view className="flex flex-row gap-x2">
            <text className="flex-1 t3-medium text-fg-neutral-muted">활성화</text>
            <text className="flex-1 t3-medium text-fg-neutral-muted">비활성화</text>
          </view>

          <view
            id="text-field-layout-comparison"
            className={isComparisonOverlapped ? "relative h-x13" : "flex flex-row gap-x2 h-x13"}
          >
            <view id="text-field-layout-enabled" className={comparisonFieldClassName}>
              <TextField value={comparisonValue} onValueChange={handleComparisonValueChange}>
                <TextFieldInput
                  id="text-field-layout-enabled-input"
                  accessibility-label="활성화된 비교 입력"
                />
              </TextField>
            </view>

            <view id="text-field-layout-disabled" className={comparisonFieldClassName}>
              <TextField value={comparisonValue} disabled>
                <TextFieldInput
                  id="text-field-layout-disabled-input"
                  accessibility-label="비활성화된 비교 입력"
                />
              </TextField>
            </view>
          </view>

          <view id="text-field-layout-overlap-toggle">
            <Checkbox
              label="두 필드 겹쳐 보기"
              checked={isComparisonOverlapped}
              onCheckedChange={handleComparisonOverlapChange}
            />
          </view>
        </view>
      </view>
    </KeyboardAvoidingScrollView>
  );
}
