const ITEMS = Array.from({ length: 30 }, (_, i) => i);

export function TestTailwindBoxPage() {
  return (
    <scroll-view
      scroll-y
      style={{ display: "flex", flexDirection: "column", gap: "12px", flex: 1 }}
    >
      <text style={{ fontSize: "20px", fontWeight: "bold" }}>Tailwind Box</text>

      {ITEMS.map((i) => (
        <view
          key={`tw-${i}`}
          className={`${i % 2 === 0 ? "bg-bg-neutral-weak" : "bg-bg-brand-weak"} px-4 py-2 rounded-lg border border-stroke-neutral flex flex-row justify-between items-center`}
        >
          <text className="t5-regular text-fg-neutral">Tailwind Item {i + 1}</text>
          <text className="t4-regular text-fg-neutral-subtle">tailwind</text>
        </view>
      ))}
    </scroll-view>
  );
}
