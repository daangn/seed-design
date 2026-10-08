import { useCallback, useState } from "@lynx-js/react";
import { Field, useFieldContext } from "@seed-design/lynx-react-field";
import { KeyboardAvoidingScrollView } from "@seed-design/lynx-react-keyboard-avoiding-scroll-view";
import { TextField, useTextFieldWithGraphemes } from "@seed-design/lynx-react-text-field";

import "../styles/text-field-headless.css";

const MAX_GRAPHEMES = 5;

function FocusState() {
  const field = useFieldContext();
  return <text className="tf-headless-meta">{`focused: ${field.focused}`}</text>;
}

export function TextFieldHeadlessPage() {
  const [log, setLog] = useState<string[]>([]);
  const [code, setCode] = useState("");
  const [nickname, setNickname] = useState("");
  const [sliced, setSliced] = useState("");
  const { textFieldRootProps, counterProps } = useTextFieldWithGraphemes({
    value: nickname,
    maxGraphemeCount: MAX_GRAPHEMES,
    onValueChange: ({ value, slicedValue }) => {
      setNickname(slicedValue);
      setSliced(`${value.length}→${slicedValue.length} UTF-16`);
    },
  });

  const push = useCallback((entry: string) => {
    "background only";
    setLog((current) => [...current.slice(-3), entry]);
  }, []);

  return (
    <KeyboardAvoidingScrollView.Root className="tf-headless-root" keyboardGap={16}>
      <view className="tf-headless-content">
        <text className="tf-headless-title">TextField (Headless)</text>
        <text className="tf-headless-meta">
          SEED Recipe 없이 @seed-design/lynx-react-text-field와 field만 소비합니다.
        </text>
        <text className="tf-headless-meta">{`log: ${log.join(" → ") || "-"}`}</text>

        <Field.Root className="tf-headless-field">
          <Field.Label className="tf-headless-label">코드 (controlled 대문자 변환)</Field.Label>
          <TextField.Root
            className="tf-headless-control"
            value={code}
            onValueChange={(value) => setCode(value.toUpperCase().replace(/[^A-Z0-9]/g, ""))}
          >
            <TextField.Input
              className="tf-headless-input"
              placeholder="abc-123"
              accessibility-label="코드"
              android-set-soft-input-mode="nothing"
              bindfocus={() => push("focus:code")}
              bindblur={() => push("blur:code")}
            />
          </TextField.Root>
          <FocusState />
          <Field.Description className="tf-headless-meta">{`value: ${code}`}</Field.Description>
        </Field.Root>

        <view className="tf-headless-spacer" />

        <Field.Root className="tf-headless-field">
          <Field.Label className="tf-headless-label">{`닉네임 (최대 ${MAX_GRAPHEMES}글자)`}</Field.Label>
          <TextField.Root className="tf-headless-control" {...textFieldRootProps}>
            <TextField.Input
              className="tf-headless-input"
              placeholder="👨‍👩‍👧‍👦 같은 이모지도 한 글자"
              accessibility-label="닉네임"
              android-set-soft-input-mode="nothing"
            />
          </TextField.Root>
          <Field.Description className="tf-headless-meta">
            {`${counterProps.current}/${counterProps.max} · ${sliced || "-"}`}
          </Field.Description>
        </Field.Root>

        <Field.Root className="tf-headless-field" readOnly>
          <Field.Label className="tf-headless-label">읽기 전용</Field.Label>
          <TextField.Root className="tf-headless-control" defaultValue="수정할 수 없는 값">
            <TextField.Input className="tf-headless-input" accessibility-label="읽기 전용" />
          </TextField.Root>
        </Field.Root>

        <Field.Root className="tf-headless-field" disabled>
          <Field.Label className="tf-headless-label">비활성</Field.Label>
          <TextField.Root className="tf-headless-control" defaultValue="입력할 수 없음">
            <TextField.Input
              className="tf-headless-input"
              accessibility-label="비활성"
              android-set-soft-input-mode="nothing"
            />
          </TextField.Root>
        </Field.Root>

        <view className="tf-headless-spacer" />

        <Field.Root className="tf-headless-field">
          <Field.Label className="tf-headless-label">소개 (여러 줄)</Field.Label>
          <TextField.Root className="tf-headless-control">
            <TextField.Textarea
              className="tf-headless-textarea"
              placeholder="줄을 늘리면 키보드 회피 위치를 다시 계산합니다."
              accessibility-label="소개"
              android-set-soft-input-mode="nothing"
              bindfocus={() => push("focus:bio")}
              bindblur={() => push("blur:bio")}
            />
          </TextField.Root>
          <FocusState />
        </Field.Root>
      </view>
    </KeyboardAvoidingScrollView.Root>
  );
}
