export function LayoutBoxPage() {
  return (
    <scroll-view scroll-y style={{ display: "flex", flexDirection: "column", gap: "12px", flex: 1 }}>
      <text style={{ fontSize: "20px", fontWeight: "bold" }}>Box (Tailwind)</text>

      <text style={{ fontSize: "16px", fontWeight: "bold" }}>Background & Padding</text>
      <view className="bg-bg-neutral-weak px-3 py-2">
        <text>bg-bg-neutral-weak with padding</text>
      </view>
      <view className="bg-bg-brand-weak px-4 py-3">
        <text>bg-bg-brand-weak with larger padding</text>
      </view>

      <text style={{ fontSize: "16px", fontWeight: "bold", marginTop: "8px" }}>Border & Radius</text>
      <view className="border border-stroke-neutral rounded-lg px-3 py-2">
        <text>Border with rounded-lg</text>
      </view>
      <view className="border-2 border-stroke-brand-weak rounded-2xl px-3 py-2">
        <text>Thicker border with rounded-2xl</text>
      </view>

      <text style={{ fontSize: "16px", fontWeight: "bold", marginTop: "8px" }}>Nested views</text>
      <view className="bg-bg-neutral-weak p-3 rounded-lg">
        <view className="bg-bg-neutral p-3 rounded-lg">
          <view className="bg-bg-brand-weak p-2 rounded">
            <text>Nested views</text>
          </view>
        </view>
      </view>

      <text style={{ fontSize: "16px", fontWeight: "bold", marginTop: "8px" }}>Dimensions</text>
      <view className="bg-bg-brand-weak flex items-center justify-center" style={{ width: "200px", height: "80px" }}>
        <text>200 x 80</text>
      </view>
    </scroll-view>
  );
}
