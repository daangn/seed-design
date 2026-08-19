import "./styles";

import { root } from "@lynx-js/react";
import { KeyboardAvoidingScrollView, TextField, useSeedClassName } from "@seed-design/lynx-react";

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
          <text className="keyboard-avoiding-scroll-view-preview__title">한 줄 입력</text>
          <text className="keyboard-avoiding-scroll-view-preview__description">
            아래 입력 영역을 탭하면 키보드 위로 자동 스크롤됩니다.
          </text>

          <view className="keyboard-avoiding-scroll-view-preview__spacer">
            <text className="keyboard-avoiding-scroll-view-preview__spacer-label">
              입력 영역이 화면 아래에 오도록 확보한 공간
            </text>
          </view>

          <view className="keyboard-avoiding-scroll-view-preview__field">
            <text className="keyboard-avoiding-scroll-view-preview__field-label">주소</text>
            <TextField.Root>
              <TextField.Input
                accessibility-label="주소"
                android-set-soft-input-mode="nothing"
                maxlength={80}
                placeholder="동네 이름을 입력해 주세요"
              />
            </TextField.Root>
          </view>

          <view className="keyboard-avoiding-scroll-view-preview__footer-space" />
        </view>
      </KeyboardAvoidingScrollView>
    </page>
  );
}

root.render(<Root />);
