import "./styles";

import { useSeedClassName, WheelPicker } from "@seed-design/lynx-react";

const options = ["낮음", "보통", "높음"].map((label) => ({ value: label, label }));

export default function WheelPickerStates() {
  const seedClassName = useSeedClassName({ colorMode: "system" });

  return (
    <view className={`${seedClassName} docs-lynx-wheel-picker-root`}>
      <view className="wheel-picker-preview wheel-picker-preview--states">
        <text id="wheel-picker-states-status" className="wheel-picker-preview__status">
          Disabled
        </text>
        <view className="wheel-picker-preview__picker">
          <WheelPicker.Root disabled>
            <WheelPicker.Column
              accessibility-label="중요도"
              options={options}
              defaultValue="보통"
            />
          </WheelPicker.Root>
        </view>
      </view>
    </view>
  );
}
