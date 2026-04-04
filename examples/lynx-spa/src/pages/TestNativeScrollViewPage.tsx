const ITEMS = Array.from({ length: 30 }, (_, i) => i);

export function TestNativeScrollViewPage() {
  return (
    <scroll-view scroll-y style={{ display: "flex", flexDirection: "column", gap: "12px", flex: 1 }}>
      <text style={{ fontSize: "20px", fontWeight: "bold" }}>Native scroll-view</text>

      <scroll-view scroll-y style={{ height: "200px", backgroundColor: "#f5f5f5", borderRadius: "8px", padding: "12px" }}>
        {ITEMS.map((i) => (
          <view key={`n-${i}`} style={{ backgroundColor: "#fff", padding: "12px", borderRadius: "4px", marginBottom: "8px" }}>
            <text>Native Item {i + 1}</text>
          </view>
        ))}
      </scroll-view>

      <scroll-view scroll-orientation="horizontal" style={{ height: "100px", backgroundColor: "#f5f5f5", borderRadius: "8px", padding: "12px" }}>
        <view style={{ display: "flex", flexDirection: "row", gap: "8px" }}>
          {ITEMS.map((i) => (
            <view key={`nh-${i}`} style={{ width: "140px", height: "70px", backgroundColor: "#e0e0e0", borderRadius: "8px", padding: "12px", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <text>Card {i + 1}</text>
            </view>
          ))}
        </view>
      </scroll-view>
    </scroll-view>
  );
}
