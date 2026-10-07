import "./styles";

import { useState } from "@lynx-js/react";

const INITIAL_VALUE =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.";

export default function Example() {
  const [value, setValue] = useState(INITIAL_VALUE);
  const [focused, setFocused] = useState(false);

  return (
    <view
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "0px",
        width: "100%",
        maxWidth: "420px",
      }}
    >
      <text
        style={{
          marginBottom: "8px",
          color: "var(--seed-color-fg-neutral)",
          fontSize: "16px",
          fontWeight: "600",
        }}
      >
        Input focus rendering
      </text>
      <input
        default-value={INITIAL_VALUE}
        bindinput={(event) => setValue(event.detail.value)}
        bindfocus={() => setFocused(true)}
        bindblur={() => setFocused(false)}
        style={{
          width: "100%",
          height: "48px",
          paddingLeft: "12px",
          paddingRight: "12px",
          borderWidth: "1px",
          borderStyle: "solid",
          borderColor: focused
            ? "var(--seed-color-stroke-focus-ring)"
            : "var(--seed-color-stroke-neutral-weak)",
          borderRadius: "8px",
          backgroundColor: "var(--seed-color-bg-layer-default)",
          color: "var(--seed-color-fg-neutral)",
          fontSize: "16px",
          lineHeight: "22px",
          fontWeight: "400",
        }}
      />
      <text
        style={{
          marginTop: "12px",
          color: "var(--seed-color-fg-neutral-muted)",
          fontSize: "14px",
        }}
      >
        State: {focused ? "focused" : "blurred"}
      </text>
      <text
        style={{
          marginTop: "8px",
          color: "var(--seed-color-fg-neutral-muted)",
          fontSize: "14px",
        }}
      >
        Value: {value}
      </text>
    </view>
  );
}
