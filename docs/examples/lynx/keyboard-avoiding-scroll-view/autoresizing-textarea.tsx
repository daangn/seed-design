import "./styles";

import { root } from "@lynx-js/react";
import { KeyboardAvoidingScrollView, useSeedClassName } from "@seed-design/lynx-react";
import { TextField, TextFieldTextarea } from "@/components/ui/text-field";

function Root() {
  const seedClassName = useSeedClassName({ colorMode: "system" });

  return (
    <page className={seedClassName}>
      <KeyboardAvoidingScrollView
        className="keyboard-avoiding-scroll-view-preview"
        keyboardGap={24}
        scrollBehavior="smooth"
      >
        <view className="keyboard-avoiding-scroll-view-preview__content">
          <text className="keyboard-avoiding-scroll-view-preview__title">여러 줄 입력</text>
          <text className="keyboard-avoiding-scroll-view-preview__description">
            줄을 추가해 입력 영역이 커져도 키보드 위의 안전한 위치를 다시 계산합니다.
          </text>

          <view className="keyboard-avoiding-scroll-view-preview__spacer">
            <text className="keyboard-avoiding-scroll-view-preview__spacer-label">
              입력 영역이 화면 아래에 오도록 확보한 공간
            </text>
          </view>

          <view className="keyboard-avoiding-scroll-view-preview__field">
            <TextField label="자기소개">
              <TextFieldTextarea
                accessibility-label="자기소개"
                android-set-soft-input-mode="nothing"
                maxlength={300}
                placeholder="여러 줄을 입력해 보세요"
              />
            </TextField>
          </view>

          <view className="keyboard-avoiding-scroll-view-preview__footer-space" />
        </view>
      </KeyboardAvoidingScrollView>
    </page>
  );
}

root.render(<Root />);
