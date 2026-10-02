import "./styles";

import * as React from "@lynx-js/react";
import { useSeedClassName } from "@seed-design/lynx-react";
import { WheelPicker } from "@/components/ui/wheel-picker";

function ColorDot({ color }: { color: string }) {
  return (
    <view
      accessibility-elements-hidden={true}
      className="wheel-picker-preview__color-dot"
      style={{ backgroundColor: color }}
    />
  );
}

const colorOptions = [
  { value: "carrot", name: "당근색", color: "#ff6f0f" },
  { value: "blue", name: "파란색", color: "#4285f4" },
  { value: "green", name: "초록색", color: "#22a06b" },
].map(({ value, name, color }) => ({
  value,
  ariaLabel: name,
  label: (
    <view className="wheel-picker-preview__color-label">
      <ColorDot color={color} />
      <text>{name}</text>
    </view>
  ),
}));

export default function WheelPickerReactElementLabel() {
  const seedClassName = useSeedClassName({ colorMode: "system" });
  const [value, setValue] = React.useState("carrot");

  return (
    <view className={`${seedClassName} docs-lynx-wheel-picker-root`}>
      <view className="wheel-picker-preview wheel-picker-preview--compact">
        <view className="wheel-picker-preview__picker">
          <WheelPicker
            columns={[
              {
                id: "color",
                "accessibility-label": "색상",
                options: colorOptions,
                value,
                onValueChange: (nextValue) => {
                  "background only";
                  setValue(nextValue);
                },
              },
            ]}
          />
        </view>
        <text id="wheel-picker-react-element-label-status" className="wheel-picker-preview__status">
          선택값: {value}
        </text>
      </view>
    </view>
  );
}
