import { vars } from "@seed-design/lynx-css/vars";

const { $color } = vars;

function SectionTitle({ children }: { children: string }) {
  return <text className="t6-bold mt-x5 mb-x2 text-fg-neutral">{children}</text>;
}

function ColorSwatch({
  name,
  varRef,
  mode,
}: {
  name: string;
  varRef: string;
  mode: "fg" | "bg" | "stroke";
}) {
  if (mode === "fg") {
    return (
      <view className="py-x1_5 px-x2 flex flex-row items-center gap-x2">
        <text className="t4-bold" style={{ color: varRef }}>
          Aa
        </text>
        <text className="t2-regular text-fg-neutral-muted">{name}</text>
      </view>
    );
  }

  if (mode === "bg") {
    return (
      <view className="py-x1_5 px-x2 flex flex-row items-center gap-x2">
        <view
          className="w-x8 h-x8 rounded-r1 border border-stroke-neutral-muted"
          style={{
            backgroundColor: varRef,
          }}
        />
        <text className="t2-regular text-fg-neutral-muted">{name}</text>
      </view>
    );
  }

  // stroke
  return (
    <view className="py-x1_5 px-x2 flex flex-row items-center gap-x2">
      <view
        className="w-x8 h-x8 border-2 rounded-r1"
        style={{
          borderColor: varRef,
        }}
      />
      <text className="t2-regular text-fg-neutral-muted">{name}</text>
    </view>
  );
}

function renderEntries(obj: Record<string, string>, mode: "fg" | "bg" | "stroke") {
  return Object.entries(obj).map(([name, varRef]) => (
    <ColorSwatch key={name} name={name} varRef={varRef} mode={mode} />
  ));
}

export function FoundationColorPage() {
  return (
    <scroll-view scroll-y className="flex flex-col gap-x1 flex-1 bg-bg-layer-default">
      <text className="t7-bold text-fg-neutral">Color</text>
      <text className="t3-regular text-fg-neutral-subtle mb-x2">
        @seed-design/lynx-css/vars — $color tokens
      </text>

      <SectionTitle>Foreground (fg)</SectionTitle>
      <view className="flex flex-row flex-wrap gap-x1">{renderEntries($color.fg, "fg")}</view>

      <SectionTitle>Background (bg)</SectionTitle>
      <view className="flex flex-row flex-wrap gap-x1">{renderEntries($color.bg, "bg")}</view>

      <SectionTitle>Stroke</SectionTitle>
      <view className="flex flex-row flex-wrap gap-x1">
        {renderEntries($color.stroke, "stroke")}
      </view>
    </scroll-view>
  );
}
