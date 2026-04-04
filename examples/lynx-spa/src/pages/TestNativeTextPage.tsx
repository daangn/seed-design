const ITEMS = Array.from({ length: 30 }, (_, i) => i);

export function TestNativeTextPage() {
  return (
    <scroll-view scroll-y style={{ display: "flex", flexDirection: "column", gap: "8px", flex: 1 }}>
      <text style={{ fontSize: "20px", fontWeight: "bold" }}>Native text</text>

      {ITEMS.map((i) => (
        <view key={`n-${i}`} style={{ padding: "8px 0" }}>
          <text style={{ fontSize: "16px", fontWeight: "bold" }}>Title {i + 1}</text>
          <text style={{ fontSize: "14px", color: "#999" }}>Subtitle for item {i + 1}</text>
        </view>
      ))}
    </scroll-view>
  );
}
