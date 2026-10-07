import "./styles";

import * as React from "@lynx-js/react";
import { WheelPicker } from "@seed-design/lynx-react";

const options = ["작게", "보통", "크게"].map((label) => ({ value: label, label }));

export default function WheelPickerPackageApi() {
  const [value, setValue] = React.useState("보통");

  return (
    <view className="wheel-picker-preview wheel-picker-preview--compact">
      <view className="wheel-picker-preview__picker">
        <WheelPicker.Root size="small">
          <WheelPicker.Column
            accessibility-label="글자 크기"
            options={options}
            value={value}
            onValueChange={(nextValue) => {
              "background only";
              setValue(nextValue);
            }}
            renderLabel={(option) => (
              <WheelPicker.ItemLabel>
                <text className="wheel-picker-preview__custom-label">{option.label}</text>
              </WheelPicker.ItemLabel>
            )}
          />
        </WheelPicker.Root>
      </view>
      <text id="wheel-picker-package-api-status" className="wheel-picker-preview__status">
        선택값: {value}
      </text>
    </view>
  );
}
