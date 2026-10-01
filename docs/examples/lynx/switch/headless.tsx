import { useState } from "@lynx-js/react";
import { Switch, useSwitchContext } from "@seed-design/lynx-react-switch";

function Track() {
  const { checked, disabled, pressed } = useSwitchContext();

  return (
    <Switch.Control
      style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: checked ? "flex-end" : "flex-start",
        width: "44px",
        height: "26px",
        padding: "3px",
        borderRadius: "13px",
        backgroundColor: checked
          ? pressed
            ? "#3a3a3c"
            : "#212124"
          : pressed
            ? "#c6c8cd"
            : "#dcdee3",
        opacity: disabled ? 0.4 : 1,
      }}
    >
      <Switch.Thumb
        style={{ width: "20px", height: "20px", borderRadius: "10px", backgroundColor: "#ffffff" }}
      />
    </Switch.Control>
  );
}

interface ItemProps {
  label: string;
  checked?: boolean;
  disabled?: boolean;
  onCheckedChange?: (checked: boolean) => void;
}

function Item({ label, ...props }: ItemProps) {
  return (
    <Switch.Root
      {...props}
      accessibility-label={label}
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "12px 0",
      }}
    >
      <text style={{ fontSize: "16px", color: "#212124" }}>{label}</text>
      <Track />
    </Switch.Root>
  );
}

export default function Example() {
  const [notification, setNotification] = useState(true);

  return (
    <view
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        justifyContent: "center",
        padding: "0 24px",
      }}
    >
      <Item label="알림 받기" checked={notification} onCheckedChange={setNotification} />
      <Item label="방해 금지" disabled={!notification} />
    </view>
  );
}
