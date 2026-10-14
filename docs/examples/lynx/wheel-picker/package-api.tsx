import "./styles";

import * as React from "@lynx-js/react";
import { WheelPickerItemLabel } from "@seed-design/lynx-react";

import { WheelPicker } from "@/components/ui/wheel-picker";

const options = ["작게", "보통", "크게"].map((label) => ({ value: label, label }));

export default function WheelPickerPackageApi() {
  const [value, setValue] = React.useState("보통");

  return (
    <view className="wheel-picker-preview wheel-picker-preview--compact">
      <view className="wheel-picker-preview__picker">
        <WheelPicker
          size="small"
          columns={[
            {
              id: "font-size",
              "accessibility-label": "글자 크기",
              options,
              value,
              onValueChange: (nextValue) => {
                "background only";
                setValue(nextValue);
              },
              renderLabel: (option) => (
                <WheelPickerItemLabel>
                  <text className="wheel-picker-preview__custom-label">{option.label}</text>
                </WheelPickerItemLabel>
              ),
            },
          ]}
        />
      </view>
      <text id="wheel-picker-package-api-status" className="wheel-picker-preview__status">
        선택값: {value}
      </text>
    </view>
  );
}
