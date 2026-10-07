import "./styles";

import {
  ActionButton,
  KeyboardAvoidingScrollView,
  useSeedClassName,
} from "@seed-design/lynx-react";
import { TextField, TextFieldInput } from "@/components/ui/text-field";

export default function Example() {
  const seedClassName = useSeedClassName({ colorMode: "system" });

  return (
    <view className={`${seedClassName} docs-lynx-keyboard-avoiding-scroll-view-root`}>
      <KeyboardAvoidingScrollView.Root
        className="keyboard-avoiding-scroll-view-preview"
        keyboardGap={16}
        scrollBehavior="smooth"
      >
        <KeyboardAvoidingScrollView.Content>
          <view className="keyboard-avoiding-scroll-view-preview__content">
            <text className="keyboard-avoiding-scroll-view-preview__title">하단 버튼</text>
            <text className="keyboard-avoiding-scroll-view-preview__description">
              입력 영역을 탭하면 하단 버튼이 키보드 위로 올라오고, 입력 영역은 버튼 위에 보이도록
              스크롤됩니다.
            </text>

            <view className="keyboard-avoiding-scroll-view-preview__spacer">
              <text className="keyboard-avoiding-scroll-view-preview__spacer-label">
                입력 영역이 화면 아래에 오도록 확보한 공간
              </text>
            </view>

            <view className="keyboard-avoiding-scroll-view-preview__field">
              <TextField label="닉네임">
                <TextFieldInput
                  accessibility-label="닉네임"
                  android-set-soft-input-mode="nothing"
                  maxlength={20}
                  placeholder="닉네임을 입력해 주세요"
                />
              </TextField>
            </view>
          </view>
        </KeyboardAvoidingScrollView.Content>

        <KeyboardAvoidingScrollView.Footer className="keyboard-avoiding-scroll-view-preview__bottom-bar">
          <ActionButton variant="brandSolid" size="large">
            완료
          </ActionButton>
        </KeyboardAvoidingScrollView.Footer>
      </KeyboardAvoidingScrollView.Root>
    </view>
  );
}
