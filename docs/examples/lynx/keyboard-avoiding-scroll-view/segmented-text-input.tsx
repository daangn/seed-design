import "./styles";

import { KeyboardAvoidingScrollView } from "@seed-design/lynx-react";
import { ResidentNumberField } from "@/components/ui/resident-number-field";

export default function Example() {
  return (
    <KeyboardAvoidingScrollView.Root
      className="keyboard-avoiding-scroll-view-preview"
      keyboardGap={24}
      scrollBehavior="smooth"
    >
      <KeyboardAvoidingScrollView.Content>
        <view className="keyboard-avoiding-scroll-view-preview__content">
          <text className="keyboard-avoiding-scroll-view-preview__title">구간 입력</text>
          <text className="keyboard-avoiding-scroll-view-preview__description">
            아래 Segment를 탭하면 Field 전체가 키보드 위로 보이도록 자동 스크롤됩니다. 다음
            Segment로 넘어가도 위치를 유지합니다.
          </text>

          <view className="keyboard-avoiding-scroll-view-preview__spacer">
            <text className="keyboard-avoiding-scroll-view-preview__spacer-label">
              입력 영역이 화면 아래에 오도록 확보한 공간
            </text>
          </view>

          <view className="keyboard-avoiding-scroll-view-preview__field">
            <ResidentNumberField label="주민등록번호" />
          </view>

          <view className="keyboard-avoiding-scroll-view-preview__footer-space" />
        </view>
      </KeyboardAvoidingScrollView.Content>
    </KeyboardAvoidingScrollView.Root>
  );
}
