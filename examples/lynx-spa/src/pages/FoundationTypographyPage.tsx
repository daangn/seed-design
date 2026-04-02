import { vars } from "@seed-design/lynx-css/vars";

const { $color, $fontSize, $lineHeight, $fontWeight } = vars;

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

function FontSizeRow({
  name,
  sizeVar,
  lineHeightVar,
}: {
  name: string;
  sizeVar: string;
  lineHeightVar?: string;
}) {
  return (
    <view
      style={{
        padding: "8px",
        borderBottomWidth: "1px",
        borderBottomColor: $color.stroke.neutralMuted,
        display: "flex",
        flexDirection: "column",
        gap: "4px",
      }}
    >
      <text style={`font-size: 11px; color: ${$color.fg.neutralSubtle};`}>
        {name} → {sizeVar}
        {lineHeightVar ? ` / ${lineHeightVar}` : ""}
      </text>
      <text
        style={`font-size: ${sizeVar}; line-height: ${lineHeightVar ?? "normal"};`}
      >
        다람쥐 헌 쳇바퀴에 타고파 The quick brown fox
      </text>
    </view>
  );
}

function FontWeightRow({ name, weightVar }: { name: string; weightVar: string }) {
  return (
    <view
      style={{
        padding: "8px",
        borderBottomWidth: "1px",
        borderBottomColor: $color.stroke.neutralMuted,
        display: "flex",
        flexDirection: "column",
        gap: "4px",
      }}
    >
      <text style={`font-size: 11px; color: ${$color.fg.neutralSubtle};`}>
        {name} → {weightVar}
      </text>
      <text style={`font-size: 16px; font-weight: ${weightVar};`}>
        다람쥐 헌 쳇바퀴에 타고파 The quick brown fox
      </text>
    </view>
  );
}

const dynamicSizes = [
  { name: "t1", size: $fontSize.t1, lh: $lineHeight.t1 },
  { name: "t2", size: $fontSize.t2, lh: $lineHeight.t2 },
  { name: "t3", size: $fontSize.t3, lh: $lineHeight.t3 },
  { name: "t4", size: $fontSize.t4, lh: $lineHeight.t4 },
  { name: "t5", size: $fontSize.t5, lh: $lineHeight.t5 },
  { name: "t6", size: $fontSize.t6, lh: $lineHeight.t6 },
  { name: "t7", size: $fontSize.t7, lh: $lineHeight.t7 },
  { name: "t8", size: $fontSize.t8, lh: $lineHeight.t8 },
  { name: "t9", size: $fontSize.t9, lh: $lineHeight.t9 },
  { name: "t10", size: $fontSize.t10, lh: $lineHeight.t10 },
];

const staticSizes = [
  { name: "t1Static", size: $fontSize.t1Static, lh: $lineHeight.t1Static },
  { name: "t2Static", size: $fontSize.t2Static, lh: $lineHeight.t2Static },
  { name: "t3Static", size: $fontSize.t3Static, lh: $lineHeight.t3Static },
  { name: "t4Static", size: $fontSize.t4Static, lh: $lineHeight.t4Static },
  { name: "t5Static", size: $fontSize.t5Static, lh: $lineHeight.t5Static },
  { name: "t6Static", size: $fontSize.t6Static, lh: $lineHeight.t6Static },
  { name: "t7Static", size: $fontSize.t7Static, lh: $lineHeight.t7Static },
  { name: "t8Static", size: $fontSize.t8Static, lh: $lineHeight.t8Static },
  { name: "t9Static", size: $fontSize.t9Static, lh: $lineHeight.t9Static },
  {
    name: "t10Static",
    size: $fontSize.t10Static,
    lh: $lineHeight.t10Static,
  },
];

export function FoundationTypographyPage() {
  return (
    <scroll-view scroll-y style={{ display: "flex", flexDirection: "column", gap: "4px", flex: 1 }}>
      <text style={{ fontSize: "20px", fontWeight: "bold" }}>Typography</text>
      <text style={{ fontSize: "13px", color: $color.fg.neutralSubtle, marginBottom: "8px" }}>
        @seed-design/lynx-css/vars — $fontSize, $lineHeight, $fontWeight tokens
      </text>

      <SectionTitle>Font Weight</SectionTitle>
      <FontWeightRow name="regular" weightVar={$fontWeight.regular} />
      <FontWeightRow name="medium" weightVar={$fontWeight.medium} />
      <FontWeightRow name="bold" weightVar={$fontWeight.bold} />

      <SectionTitle>Font Size (Dynamic)</SectionTitle>
      <text style={{ fontSize: "12px", color: $color.fg.neutralSubtle, marginBottom: "4px" }}>
        사용자 설정에 따라 크기가 변하는 동적 사이즈
      </text>
      {dynamicSizes.map((item) => (
        <FontSizeRow key={item.name} name={item.name} sizeVar={item.size} lineHeightVar={item.lh} />
      ))}

      <SectionTitle>Font Size (Static)</SectionTitle>
      <text style={{ fontSize: "12px", color: $color.fg.neutralSubtle, marginBottom: "4px" }}>
        고정 크기 사이즈
      </text>
      {staticSizes.map((item) => (
        <FontSizeRow key={item.name} name={item.name} sizeVar={item.size} lineHeightVar={item.lh} />
      ))}
    </scroll-view>
  );
}
