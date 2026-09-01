import "./styles";

import { root } from "@lynx-js/react";
import { ScaleFeedback, useScaleFeedback, useSeedClassName } from "@seed-design/lynx-react";

function Root() {
  const seedClassName = useSeedClassName({ colorMode: "system" });
  const content = useScaleFeedback();

  return (
    <page className={seedClassName}>
      <view className="scale-feedback-example">
        <text className="scale-feedback-example__label">Self Scale</text>
        <ScaleFeedback>
          <view className="scale-feedback-example__self">
            <text className="scale-feedback-example__self-text">표면 전체가 줄어듭니다</text>
          </view>
        </ScaleFeedback>

        <text className="scale-feedback-example__label">Content Scale</text>
        <view
          className="scale-feedback-example__content-root"
          {...content.scaleFeedbackTriggerProps}
        >
          <view className="scale-feedback-example__content" {...content.scaleFeedbackTargetProps}>
            <text className="scale-feedback-example__content-text">
              배경은 그대로, 콘텐츠만 줄어듭니다
            </text>
          </view>
        </view>
      </view>
    </page>
  );
}

root.render(<Root />);
