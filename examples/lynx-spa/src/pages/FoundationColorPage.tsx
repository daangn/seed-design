import { vars } from "@seed-design/css/vars";

const { $color } = vars;

function SectionTitle({ children }: { children: string }) {
  return (
    <text
      style={{
        fontSize: "18px",
        fontWeight: "bold",
        marginTop: "20px",
        marginBottom: "8px",
      }}
    >
      {children}
    </text>
  );
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
      <view
        style={{
          padding: "6px 8px",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: "8px",
        }}
      >
        <text style={{ color: varRef, fontSize: "14px", fontWeight: "bold" }}>
          Aa
        </text>
        <text style={{ fontSize: "12px", color: "#666" }}>{name}</text>
      </view>
    );
  }

  if (mode === "bg") {
    return (
      <view
        style={{
          padding: "6px 8px",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: "8px",
        }}
      >
        <view
          style={{
            width: "32px",
            height: "32px",
            backgroundColor: varRef,
            borderRadius: "4px",
            borderWidth: "1px",
            borderColor: "rgba(0,0,0,0.1)",
          }}
        />
        <text style={{ fontSize: "12px", color: "#666" }}>{name}</text>
      </view>
    );
  }

  // stroke
  return (
    <view
      style={{
        padding: "6px 8px",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap: "8px",
      }}
    >
      <view
        style={{
          width: "32px",
          height: "32px",
          borderWidth: "2px",
          borderColor: varRef,
          borderRadius: "4px",
        }}
      />
      <text style={{ fontSize: "12px", color: "#666" }}>{name}</text>
    </view>
  );
}

function renderEntries(
  obj: Record<string, string>,
  mode: "fg" | "bg" | "stroke",
) {
  return Object.entries(obj).map(([name, varRef]) => (
    <ColorSwatch key={name} name={name} varRef={varRef} mode={mode} />
  ));
}

export function FoundationColorPage() {
  return (
    <scroll-view scroll-y style={{ display: "flex", flexDirection: "column", gap: "4px", flex: 1 }}>
      <text style={{ fontSize: "20px", fontWeight: "bold" }}>Color</text>
      <text style={{ fontSize: "13px", color: "#999", marginBottom: "8px" }}>
        @seed-design/css/vars — $color tokens
      </text>

      <SectionTitle>Foreground (fg)</SectionTitle>
      <view
        style={{
          display: "flex",
          flexDirection: "row",
          flexWrap: "wrap",
          gap: "4px",
        }}
      >
        {renderEntries($color.fg, "fg")}
      </view>

      <SectionTitle>Background (bg)</SectionTitle>
      <view
        style={{
          display: "flex",
          flexDirection: "row",
          flexWrap: "wrap",
          gap: "4px",
        }}
      >
        {renderEntries($color.bg, "bg")}
      </view>

      <SectionTitle>Stroke</SectionTitle>
      <view
        style={{
          display: "flex",
          flexDirection: "row",
          flexWrap: "wrap",
          gap: "4px",
        }}
      >
        {renderEntries($color.stroke, "stroke")}
      </view>
    </scroll-view>
  );
}
