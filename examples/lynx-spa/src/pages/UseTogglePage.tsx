import { useState } from "@lynx-js/react";
import { ActionButton, mergeProps } from "@seed-design/lynx-react";
import { useToggle } from "@seed-design/lynx-react-toggle";

export function UseTogglePage() {
  const [disabled, setDisabled] = useState(false);
  const [events, setEvents] = useState(0);
  const toggle = useToggle({ disabled });
  return (
    <view>
      <view
        {...mergeProps(toggle.rootProps, { bindtap: () => setEvents((value) => value + 1) })}
        accessibility-traits="button"
        accessibility-label="Toggle sample"
        style={{ padding: "24px", backgroundColor: toggle.active ? "#d1d3d8" : "#eceef0" }}
      >
        <text>{`선택: ${toggle.pressed ? "on" : "off"} / 누름: ${toggle.active ? "on" : "off"}`}</text>
      </view>
      <text>{`사용자 tap: ${events}`}</text>
      <ActionButton bindtap={() => setDisabled(!disabled)}>
        {disabled ? "활성화" : "비활성화"}
      </ActionButton>
    </view>
  );
}
