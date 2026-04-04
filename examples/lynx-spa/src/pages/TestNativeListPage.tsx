const ITEMS = Array.from({ length: 50 }, (_, i) => ({
  id: `item-${i}`,
  title: `Native Item ${i + 1}`,
}));

export function TestNativeListPage() {
  return (
    <scroll-view scroll-y style={{ display: "flex", flexDirection: "column", gap: "12px", flex: 1 }}>
      <text style={{ fontSize: "20px", fontWeight: "bold" }}>Native list + list-item</text>

      <list list-type="single" style={{ height: "300px" }}>
        {ITEMS.map((item) => (
          <list-item item-key={item.id} key={item.id}>
            <view style={{ padding: "12px 16px", borderBottomWidth: "1px", borderBottomColor: "#e0e0e0" }}>
              <text>{item.title}</text>
            </view>
          </list-item>
        ))}
      </list>

      <text style={{ fontSize: "16px", fontWeight: "bold", marginTop: "8px" }}>Horizontal</text>
      <list list-type="single" scroll-orientation="horizontal" style={{ height: "120px" }}>
        {ITEMS.slice(0, 20).map((item) => (
          <list-item item-key={`h-${item.id}`} key={`h-${item.id}`}>
            <view style={{ width: "140px", height: "100px", backgroundColor: "#f5f5f5", borderRadius: "8px", padding: "12px", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <text>{item.title}</text>
            </view>
          </list-item>
        ))}
      </list>
    </scroll-view>
  );
}
