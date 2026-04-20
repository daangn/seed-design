import { Count } from "@seed-design/lynx-react";

export function CountPage() {
  return (
    <scroll-view
      scroll-y
      style={{ display: "flex", flexDirection: "column", gap: "12px", flex: 1 }}
    >
      <text style={{ fontSize: "20px", fontWeight: "bold" }}>Count</text>

      <text style={{ fontSize: "16px", fontWeight: "bold" }}>Default</text>
      <view
        style={{
          display: "flex",
          flexDirection: "row",
          gap: "12px",
          alignItems: "center",
        }}
      >
        <Count>1</Count>
        <Count>12</Count>
        <Count>99+</Count>
      </view>

      <text style={{ fontSize: "16px", fontWeight: "bold", marginTop: "8px" }}>
        Inline with text
      </text>
      <view
        style={{
          display: "flex",
          flexDirection: "row",
          gap: "4px",
          alignItems: "baseline",
        }}
      >
        <text style={{ fontSize: "16px" }}>댓글</text>
        <Count>24</Count>
      </view>
    </scroll-view>
  );
}
