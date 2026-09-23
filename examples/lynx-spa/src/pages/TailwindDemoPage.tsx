export function TailwindDemoPage() {
  return (
    <scroll-view scroll-y className="flex flex-col gap-x4 flex-1 bg-bg-layer-default">
      <text className="t7-bold text-fg-neutral">Tailwind + SEED Tokens</text>

      {/* Colors */}
      <text className="t5-bold text-fg-neutral">Background Colors</text>
      <view className="flex flex-col gap-x2">
        <view className="bg-bg-layer-default p-x3 rounded-r2 border border-stroke-neutral-muted">
          <text className="text-fg-neutral">bg-bg-layer-default</text>
        </view>
        <view className="bg-bg-neutral-weak p-x3 rounded-r2">
          <text className="text-fg-neutral">bg-bg-neutral-weak</text>
        </view>
        <view className="bg-bg-brand-weak p-x3 rounded-r2">
          <text className="text-fg-neutral">bg-bg-brand-weak</text>
        </view>
        <view className="bg-bg-brand-solid p-x3 rounded-r2">
          <text className="text-fg-on-brand-solid">bg-bg-brand-solid</text>
        </view>
        <view className="bg-bg-critical-weak p-x3 rounded-r2">
          <text className="text-fg-critical">bg-bg-critical-weak</text>
        </view>
      </view>

      {/* Text Colors */}
      <text className="t5-bold mt-x2 text-fg-neutral">Text Colors</text>
      <view className="flex flex-col gap-x1">
        <text className="t5-regular text-fg-neutral">text-fg-neutral</text>
        <text className="t5-regular text-fg-neutral-subtle">text-fg-neutral-subtle</text>
        <text className="t5-regular text-fg-brand">text-fg-brand</text>
        <text className="t5-regular text-fg-critical">text-fg-critical</text>
        <text className="t5-regular text-fg-positive">text-fg-positive</text>
        <text className="t5-regular text-fg-informative">text-fg-informative</text>
      </view>

      {/* Typography */}
      <text className="t5-bold mt-x2 text-fg-neutral">Typography Scale</text>
      <view className="flex flex-col gap-x1">
        <text className="t1-regular text-fg-neutral">t1-regular (smallest)</text>
        <text className="t3-regular text-fg-neutral">t3-regular</text>
        <text className="t5-regular text-fg-neutral">t5-regular (body)</text>
        <text className="t5-bold text-fg-neutral">t5-bold</text>
        <text className="t7-bold text-fg-neutral">t7-bold</text>
        <text className="t10-bold text-fg-neutral">t10-bold (largest)</text>
      </view>

      {/* Flex Layout */}
      <text className="t5-bold mt-x2 text-fg-neutral">Flex Row</text>
      <view className="flex flex-row gap-x2">
        <view className="bg-bg-brand-weak px-x3 py-x2 rounded-r1 flex-1">
          <text className="t5-regular text-fg-neutral">A</text>
        </view>
        <view className="bg-bg-brand-weak px-x3 py-x2 rounded-r1 flex-1">
          <text className="t5-regular text-fg-neutral">B</text>
        </view>
        <view className="bg-bg-brand-weak px-x3 py-x2 rounded-r1 flex-1">
          <text className="t5-regular text-fg-neutral">C</text>
        </view>
      </view>

      <text className="t5-bold mt-x2 text-fg-neutral">Flex Column</text>
      <view className="flex flex-col gap-x2">
        <view className="bg-bg-neutral-weak px-x3 py-x2 rounded-r2">
          <text className="t5-regular text-fg-neutral">Item 1</text>
        </view>
        <view className="bg-bg-neutral-weak px-x3 py-x2 rounded-r2">
          <text className="t5-regular text-fg-neutral">Item 2</text>
        </view>
      </view>

      {/* Border */}
      <text className="t5-bold mt-x2 text-fg-neutral">Border & Radius</text>
      <view className="flex flex-row gap-x2">
        <view className="border border-stroke-neutral-muted rounded-r1 p-x3">
          <text className="t4-regular text-fg-neutral">rounded</text>
        </view>
        <view className="border border-stroke-neutral-muted rounded-r2 p-x3">
          <text className="t4-regular text-fg-neutral">rounded-lg</text>
        </view>
        <view className="border border-stroke-neutral-muted rounded-full p-x3">
          <text className="t4-regular text-fg-neutral">full</text>
        </view>
      </view>

      {/* Justify & Align */}
      <text className="t5-bold mt-x2 text-fg-neutral">justify-between + items-center</text>
      <view className="flex flex-row justify-between items-center bg-bg-neutral-weak p-x3 rounded-r2">
        <text className="t5-bold text-fg-neutral">Title</text>
        <text className="t4-regular text-fg-neutral-subtle">Detail</text>
      </view>
    </scroll-view>
  );
}
