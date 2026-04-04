export function LayoutTextPage() {
  return (
    <scroll-view scroll-y style={{ display: "flex", flexDirection: "column", gap: "12px", flex: 1 }}>
      <text style={{ fontSize: "20px", fontWeight: "bold" }}>Text (Tailwind)</text>

      <text style={{ fontSize: "16px", fontWeight: "bold" }}>Dynamic Text Styles (sp)</text>
      <text style={{ fontSize: "11px", color: "#999", marginBottom: "4px" }}>
        시스템 폰트 크기 설정에 반응합니다
      </text>
      <view className="flex flex-col gap-1">
        <text className="t1-regular text-fg-neutral">t1-regular</text>
        <text className="t2-regular text-fg-neutral">t2-regular</text>
        <text className="t3-regular text-fg-neutral">t3-regular</text>
        <text className="t4-regular text-fg-neutral">t4-regular</text>
        <text className="t5-regular text-fg-neutral">t5-regular</text>
        <text className="t6-bold text-fg-neutral">t6-bold</text>
        <text className="t7-bold text-fg-neutral">t7-bold</text>
        <text className="t8-bold text-fg-neutral">t8-bold</text>
        <text className="t9-bold text-fg-neutral">t9-bold</text>
        <text className="t10-bold text-fg-neutral">t10-bold</text>
      </view>

      <text style={{ fontSize: "16px", fontWeight: "bold", marginTop: "8px" }}>Colors</text>
      <view className="flex flex-col gap-1">
        <text className="t5-regular text-fg-neutral">text-fg-neutral</text>
        <text className="t5-regular text-fg-neutral-subtle">text-fg-neutral-subtle</text>
        <text className="t5-regular text-fg-brand">text-fg-brand</text>
        <text className="t5-regular text-fg-critical">text-fg-critical</text>
        <text className="t5-regular text-fg-positive">text-fg-positive</text>
      </view>

      <text style={{ fontSize: "16px", fontWeight: "bold", marginTop: "8px" }}>Font Weights</text>
      <view className="flex flex-col gap-1">
        <text className="t5-regular text-fg-neutral">Regular</text>
        <text className="t5-medium text-fg-neutral">Medium</text>
        <text className="t5-bold text-fg-neutral">Bold</text>
      </view>

      <text style={{ fontSize: "16px", fontWeight: "bold", marginTop: "8px" }}>Alignment</text>
      <view className="flex flex-col gap-1">
        <text className="t5-regular text-fg-neutral text-left">Left aligned</text>
        <text className="t5-regular text-fg-neutral text-center">Center aligned</text>
        <text className="t5-regular text-fg-neutral text-right">Right aligned</text>
      </view>
    </scroll-view>
  );
}
