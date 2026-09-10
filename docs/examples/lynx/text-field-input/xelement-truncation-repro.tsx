import { root, useState } from "@lynx-js/react";

const INITIAL_VALUE =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.";

function Root() {
  const [value, setValue] = useState(INITIAL_VALUE);
  const [focused, setFocused] = useState(false);

  return (
    <page style={{ backgroundColor: "#ffffff" }}>
      <view style={{ padding: "32px" }}>
        <text style={{ marginBottom: "8px", fontSize: "16px", fontWeight: "600" }}>
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
            borderColor: focused ? "#111111" : "#d1d1d1",
            borderRadius: "8px",
            backgroundColor: "#ffffff",
            color: "#111111",
            fontSize: "16px",
            lineHeight: "22px",
            fontWeight: "400",
          }}
        />
        <text style={{ marginTop: "12px", color: "#666666", fontSize: "14px" }}>
          State: {focused ? "focused" : "blurred"}
        </text>
        <text style={{ marginTop: "8px", color: "#666666", fontSize: "14px" }}>
          Value: {value}
        </text>
      </view>
    </page>
  );
}

root.render(<Root />);
