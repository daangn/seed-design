export function TailwindDemoPage() {
  return (
    <scroll-view scroll-y style={{ display: "flex", flexDirection: "column", gap: "16px", flex: 1 }}>
      <text style={{ fontSize: "20px", fontWeight: "bold" }}>Tailwind + SEED Tokens</text>

      {/* Colors */}
      <text style={{ fontSize: "16px", fontWeight: "bold" }}>Background Colors</text>
      <view className="flex flex-col gap-2">
        <view className="bg-bg-layer-default p-3 rounded-lg border border-stroke-neutral">
          <text className="text-fg-neutral">bg-bg-layer-default</text>
        </view>
        <view className="bg-bg-neutral-weak p-3 rounded-lg">
          <text className="text-fg-neutral">bg-bg-neutral-weak</text>
        </view>
        <view className="bg-bg-brand-weak p-3 rounded-lg">
          <text className="text-fg-neutral">bg-bg-brand-weak</text>
        </view>
        <view className="bg-bg-brand-solid p-3 rounded-lg">
          <text className="text-fg-neutral-inverted">bg-bg-brand-solid</text>
        </view>
        <view className="bg-bg-critical-weak p-3 rounded-lg">
          <text className="text-fg-critical">bg-bg-critical-weak</text>
        </view>
      </view>

      {/* Text Colors */}
      <text style={{ fontSize: "16px", fontWeight: "bold", marginTop: "8px" }}>Text Colors</text>
      <view className="flex flex-col gap-1">
        <text className="t5-regular text-fg-neutral">text-fg-neutral</text>
        <text className="t5-regular text-fg-neutral-subtle">text-fg-neutral-subtle</text>
        <text className="t5-regular text-fg-brand">text-fg-brand</text>
        <text className="t5-regular text-fg-critical">text-fg-critical</text>
        <text className="t5-regular text-fg-positive">text-fg-positive</text>
        <text className="t5-regular text-fg-informative">text-fg-informative</text>
      </view>

      {/* Typography */}
      <text style={{ fontSize: "16px", fontWeight: "bold", marginTop: "8px" }}>Typography Scale</text>
      <view className="flex flex-col gap-1">
        <text className="t1-regular text-fg-neutral">t1-regular (smallest)</text>
        <text className="t3-regular text-fg-neutral">t3-regular</text>
        <text className="t5-regular text-fg-neutral">t5-regular (body)</text>
        <text className="t5-bold text-fg-neutral">t5-bold</text>
        <text className="t7-bold text-fg-neutral">t7-bold</text>
        <text className="t10-bold text-fg-neutral">t10-bold (largest)</text>
      </view>

      {/* Flex Layout */}
      <text style={{ fontSize: "16px", fontWeight: "bold", marginTop: "8px" }}>Flex Row</text>
      <view className="flex flex-row gap-2">
        <view className="bg-bg-brand-weak px-3 py-2 rounded flex-1">
          <text className="t5-regular">A</text>
        </view>
        <view className="bg-bg-brand-weak px-3 py-2 rounded flex-1">
          <text className="t5-regular">B</text>
        </view>
        <view className="bg-bg-brand-weak px-3 py-2 rounded flex-1">
          <text className="t5-regular">C</text>
        </view>
      </view>

      <text style={{ fontSize: "16px", fontWeight: "bold", marginTop: "8px" }}>Flex Column</text>
      <view className="flex flex-col gap-2">
        <view className="bg-bg-neutral-weak px-3 py-2 rounded-lg">
          <text className="t5-regular text-fg-neutral">Item 1</text>
        </view>
        <view className="bg-bg-neutral-weak px-3 py-2 rounded-lg">
          <text className="t5-regular text-fg-neutral">Item 2</text>
        </view>
      </view>

      {/* Border */}
      <text style={{ fontSize: "16px", fontWeight: "bold", marginTop: "8px" }}>Border & Radius</text>
      <view className="flex flex-row gap-2">
        <view className="border border-stroke-neutral rounded p-3">
          <text className="t4-regular">rounded</text>
        </view>
        <view className="border border-stroke-neutral rounded-lg p-3">
          <text className="t4-regular">rounded-lg</text>
        </view>
        <view className="border border-stroke-neutral rounded-full p-3">
          <text className="t4-regular">full</text>
        </view>
      </view>

      {/* Justify & Align */}
      <text style={{ fontSize: "16px", fontWeight: "bold", marginTop: "8px" }}>justify-between + items-center</text>
      <view className="flex flex-row justify-between items-center bg-bg-neutral-weak p-3 rounded-lg">
        <text className="t5-bold text-fg-neutral">Title</text>
        <text className="t4-regular text-fg-neutral-subtle">Detail</text>
      </view>
    </scroll-view>
  );
}
