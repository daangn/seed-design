import { useCallback, useEffect, useRef, useState } from "@lynx-js/react";
import type { NodesRef } from "@lynx-js/types";
import {
  KeyboardAvoidingScrollView,
  useKeyboardAvoidingScrollViewContext,
  type KeyboardAvoidanceRegistration,
} from "@seed-design/lynx-react-keyboard-avoiding-scroll-view";

import "../styles/keyboard-avoiding-scroll-view-headless.css";

type RegisteredNode = NonNullable<KeyboardAvoidanceRegistration["nativeRef"]["current"]>;

interface NativeFieldProps {
  label: string;
  description: string;
  multiline?: boolean;
  readOnly?: boolean;
  onEvent: (entry: string) => void;
}

function NativeField({ label, description, multiline, readOnly, onEvent }: NativeFieldProps) {
  const keyboardAvoidance = useKeyboardAvoidingScrollViewContext();
  const ownerRef = useRef<object>({});
  const fieldRef = useRef<RegisteredNode | null>(null);
  const nativeRef = useRef<RegisteredNode | null>(null);

  // 이 workspace에서는 예제와 headless 패키지가 서로 다른 @lynx-js/types 버전을 해석하므로
  // native ref를 등록 타입으로 옮겨 담는다. 단일 버전을 쓰는 앱에서는 ref 객체를 그대로 넘긴다.
  const setFieldRef = useCallback((node: NodesRef | null) => {
    "background only";
    fieldRef.current = node as RegisteredNode | null;
  }, []);
  const setNativeRef = useCallback((node: NodesRef | null) => {
    "background only";
    nativeRef.current = node as RegisteredNode | null;
  }, []);

  useEffect(
    () => () => {
      keyboardAvoidance.unregister(ownerRef.current);
    },
    [keyboardAvoidance],
  );

  const handleFocus = () => {
    "background only";
    keyboardAvoidance.focus({
      owner: ownerRef.current,
      nativeRef,
      fieldRef,
      enabled: !readOnly,
    });
    onEvent(`focus:${label}`);
  };

  const handleBlur = () => {
    "background only";
    keyboardAvoidance.blur(ownerRef.current);
    onEvent(`blur:${label}`);
  };

  const handleLayoutChange = () => {
    "background only";
    keyboardAvoidance.layoutChanged(ownerRef.current);
  };

  return (
    <view ref={setFieldRef} className="kav-headless-field">
      <text className="kav-headless-label">{label}</text>
      {multiline ? (
        <textarea
          ref={setNativeRef}
          className="kav-headless-textarea"
          placeholder={label}
          readonly={readOnly}
          android-set-soft-input-mode="nothing"
          bindfocus={handleFocus}
          bindblur={handleBlur}
          bindlayoutchange={handleLayoutChange}
        />
      ) : (
        <input
          ref={setNativeRef}
          className="kav-headless-input"
          placeholder={label}
          readonly={readOnly}
          android-set-soft-input-mode="nothing"
          bindfocus={handleFocus}
          bindblur={handleBlur}
        />
      )}
      <text className="kav-headless-description">{description}</text>
    </view>
  );
}

export function KeyboardAvoidingScrollViewHeadlessPage() {
  const [log, setLog] = useState<string[]>([]);
  const [scrollCount, setScrollCount] = useState(0);

  const push = useCallback((entry: string) => {
    "background only";
    setLog((current) => [...current.slice(-3), entry]);
  }, []);

  const handleScrollEnd = useCallback(() => {
    "background only";
    setScrollCount((count) => count + 1);
  }, []);

  return (
    <KeyboardAvoidingScrollView.Root className="kav-headless-root" keyboardGap={16}>
      <KeyboardAvoidingScrollView.Content
        className="kav-headless-scroll"
        bindscrollend={handleScrollEnd}
      >
        <view className="kav-headless-content">
          <text className="kav-headless-title">KeyboardAvoidingScrollView (Headless)</text>
          <text className="kav-headless-description">
            SEED Recipe 없이 native input이 Context로 등록합니다. 아래 입력을 차례로 탭해 Footer와
            입력 사이에 16px이 남는지, 다른 입력으로 focus를 옮겨도 위치를 이어받는지 확인합니다.
          </text>
          <text className="kav-headless-log">{`log: ${log.join(" → ") || "-"}`}</text>
          <text className="kav-headless-log">{`scrollend: ${scrollCount}`}</text>
          <view className="kav-headless-spacer" />
          <NativeField
            label="이름"
            description="focus하면 Field 전체가 Footer 위에 오도록 스크롤합니다."
            onEvent={push}
          />
          <NativeField
            label="닉네임 (readonly)"
            description="readonly 입력은 enabled: false로 등록해 스크롤하지 않습니다."
            readOnly
            onEvent={push}
          />
          <view className="kav-headless-spacer" />
          <NativeField
            label="소개"
            description="여러 줄을 입력해 높이가 바뀌면 layoutChanged로 다시 계산합니다."
            multiline
            onEvent={push}
          />
        </view>
      </KeyboardAvoidingScrollView.Content>
      <KeyboardAvoidingScrollView.Footer className="kav-headless-footer">
        <NativeField
          label="메모 (Footer)"
          description="Footer 안 입력은 Footer와 함께 키보드 위로 올라가고 Content를 스크롤하지 않습니다."
          onEvent={push}
        />
      </KeyboardAvoidingScrollView.Footer>
    </KeyboardAvoidingScrollView.Root>
  );
}
