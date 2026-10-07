import "./styles";

import { ScaleFeedback, useScaleFeedback } from "@seed-design/lynx-react";

export default function Example() {
  const content = useScaleFeedback();

  return (
    <view className="scale-feedback-example">
      <text className="scale-feedback-example__label">Self Scale</text>
      <ScaleFeedback>
        <view className="scale-feedback-example__self">
          <text className="scale-feedback-example__self-text">표면 전체가 줄어듭니다</text>
        </view>
      </ScaleFeedback>
      <text className="scale-feedback-example__label">Content Scale</text>
      <view className="scale-feedback-example__content-root" {...content.scaleFeedbackTriggerProps}>
        <view className="scale-feedback-example__content" {...content.scaleFeedbackTargetProps}>
          <text className="scale-feedback-example__content-text">
            배경은 그대로, 콘텐츠만 줄어듭니다
          </text>
        </view>
      </view>
    </view>
  );
}
