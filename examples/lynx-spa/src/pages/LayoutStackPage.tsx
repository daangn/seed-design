function ColorBox({ label, className = "bg-bg-brand-weak" }: { label: string; className?: string }) {
  return (
    <view className={`${className} px-3 py-2 rounded`}>
      <text>{label}</text>
    </view>
  );
}

export function LayoutStackPage() {
  return (
    <scroll-view scroll-y style={{ display: "flex", flexDirection: "column", gap: "12px", flex: 1 }}>
      <text style={{ fontSize: "20px", fontWeight: "bold" }}>VStack / HStack (Tailwind)</text>

      <text style={{ fontSize: "16px", fontWeight: "bold" }}>VStack (flex-col)</text>
      <view className="flex flex-col gap-2">
        <ColorBox label="Item 1" />
        <ColorBox label="Item 2" />
        <ColorBox label="Item 3" />
      </view>

      <text style={{ fontSize: "16px", fontWeight: "bold", marginTop: "8px" }}>HStack (flex-row)</text>
      <view className="flex flex-row gap-2">
        <ColorBox label="A" />
        <ColorBox label="B" />
        <ColorBox label="C" />
      </view>

      <text style={{ fontSize: "16px", fontWeight: "bold", marginTop: "8px" }}>VStack with items-center</text>
      <view className="flex flex-col gap-2 items-center bg-bg-neutral-weak p-3 rounded-lg">
        <ColorBox label="Short" />
        <ColorBox label="Medium Text" />
        <ColorBox label="A Longer Item" />
      </view>

      <text style={{ fontSize: "16px", fontWeight: "bold", marginTop: "8px" }}>HStack with items-center</text>
      <view className="flex flex-row gap-2 items-center">
        <view className="bg-bg-brand-weak px-3 py-1 rounded"><text>Small</text></view>
        <view className="bg-bg-critical-weak px-3 py-4 rounded"><text>Tall</text></view>
        <view className="bg-bg-brand-weak px-3 py-2 rounded"><text>Medium</text></view>
      </view>

      <text style={{ fontSize: "16px", fontWeight: "bold", marginTop: "8px" }}>Nested Stacks</text>
      <view className="flex flex-col gap-3 bg-bg-neutral-weak p-3 rounded-lg">
        <view className="flex flex-row gap-2">
          <ColorBox label="Row 1 - A" />
          <ColorBox label="Row 1 - B" />
        </view>
        <view className="flex flex-row gap-2">
          <ColorBox label="Row 2 - A" className="bg-bg-critical-weak" />
          <ColorBox label="Row 2 - B" className="bg-bg-critical-weak" />
          <ColorBox label="Row 2 - C" className="bg-bg-critical-weak" />
        </view>
      </view>
    </scroll-view>
  );
}
