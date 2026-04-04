function ColorBox({ label, className = "bg-bg-brand-weak" }: { label: string; className?: string }) {
  return (
    <view className={`${className} px-3 py-2 rounded`}>
      <text>{label}</text>
    </view>
  );
}

export function LayoutFlexPage() {
  return (
    <scroll-view scroll-y style={{ display: "flex", flexDirection: "column", gap: "12px", flex: 1 }}>
      <text style={{ fontSize: "20px", fontWeight: "bold" }}>Flex (Tailwind)</text>

      <text style={{ fontSize: "16px", fontWeight: "bold" }}>Direction: Row</text>
      <view className="flex flex-row gap-2">
        <ColorBox label="A" />
        <ColorBox label="B" />
        <ColorBox label="C" />
      </view>

      <text style={{ fontSize: "16px", fontWeight: "bold", marginTop: "8px" }}>Direction: Column</text>
      <view className="flex flex-col gap-2">
        <ColorBox label="A" />
        <ColorBox label="B" />
        <ColorBox label="C" />
      </view>

      <text style={{ fontSize: "16px", fontWeight: "bold", marginTop: "8px" }}>Align & Justify</text>
      <view className="flex flex-row gap-2 justify-between items-center bg-bg-neutral-weak p-3 rounded-lg">
        <ColorBox label="Start" />
        <ColorBox label="Center" className="bg-bg-critical-weak" />
        <ColorBox label="End" />
      </view>

      <text style={{ fontSize: "16px", fontWeight: "bold", marginTop: "8px" }}>Justify: Center</text>
      <view className="flex flex-row gap-2 justify-center bg-bg-neutral-weak p-3 rounded-lg">
        <ColorBox label="A" />
        <ColorBox label="B" />
      </view>

      <text style={{ fontSize: "16px", fontWeight: "bold", marginTop: "8px" }}>Wrap</text>
      <view className="flex flex-row gap-2 flex-wrap bg-bg-neutral-weak p-3 rounded-lg">
        <ColorBox label="Item 1" />
        <ColorBox label="Item 2" />
        <ColorBox label="Item 3" />
        <ColorBox label="Item 4" />
        <ColorBox label="Item 5" />
        <ColorBox label="Item 6" />
      </view>

      <text style={{ fontSize: "16px", fontWeight: "bold", marginTop: "8px" }}>Grow</text>
      <view className="flex flex-row gap-2">
        <view className="bg-bg-brand-weak px-3 py-2 rounded flex-1">
          <text>grow=1</text>
        </view>
        <view className="bg-bg-critical-weak px-3 py-2 rounded flex-[2]">
          <text>grow=2</text>
        </view>
      </view>
    </scroll-view>
  );
}
