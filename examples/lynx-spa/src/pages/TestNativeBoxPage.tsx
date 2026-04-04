const ITEMS = Array.from({ length: 30 }, (_, i) => i);

export function TestNativeBoxPage() {
  return (
    <scroll-view scroll-y style={{ display: "flex", flexDirection: "column", gap: "12px", flex: 1 }}>
      <text style={{ fontSize: "20px", fontWeight: "bold" }}>Native view</text>

      {ITEMS.map((i) => (
        <view
          key={`n-${i}`}
          style={{
            backgroundColor: i % 2 === 0 ? "#f5f5f5" : "#e8f5e9",
            padding: "8px 16px",
            borderRadius: "8px",
            borderWidth: "1px",
            borderColor: "#e0e0e0",
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <text style={{ fontSize: "14px" }}>Native Item {i + 1}</text>
          <text style={{ fontSize: "12px", color: "#999" }}>native</text>
        </view>
      ))}
    </scroll-view>
  );
}
