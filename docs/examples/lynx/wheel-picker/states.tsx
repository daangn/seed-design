import "./styles";

import { WheelPicker } from "@/components/ui/wheel-picker";

const options = ["낮음", "보통", "높음"].map((label) => ({ value: label, label }));

export default function WheelPickerStates() {
  return (
    <view className="wheel-picker-preview wheel-picker-preview--states">
      <text id="wheel-picker-states-status" className="wheel-picker-preview__status">
        Disabled
      </text>
      <view className="wheel-picker-preview__picker">
        <WheelPicker
          disabled
          columns={[
            {
              id: "priority",
              "accessibility-label": "중요도",
              options,
              defaultValue: "보통",
            },
          ]}
        />
      </view>
    </view>
  );
}
