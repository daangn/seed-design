import { useState } from "@lynx-js/react";
import {
  TagGroupItem,
  TagGroupItemLabel,
  TagGroupRoot,
  type TagGroupRootProps,
} from "@seed-design/lynx-react";
import { vars } from "@seed-design/lynx-css/vars";

const { $color } = vars;

type Size = NonNullable<TagGroupRootProps["size"]>;

function SectionHeader({ children }: { children: string }) {
  return (
    <text
      style={{
        fontSize: "14px",
        fontWeight: "bold",
        marginTop: "16px",
        marginBottom: "8px",
        color: $color.fg.neutralSubtle,
      }}
    >
      {children}
    </text>
  );
}

function Toggle({
  label,
  active,
  onTap,
}: {
  label: string;
  active: boolean;
  onTap: () => void;
}) {
  return (
    <view
      bindtap={onTap}
      style={{
        paddingLeft: "12px",
        paddingRight: "12px",
        paddingTop: "6px",
        paddingBottom: "6px",
        borderRadius: "8px",
        borderWidth: "1px",
        borderColor: active ? $color.stroke.brandSolid : $color.stroke.neutralMuted,
        backgroundColor: active ? $color.bg.brandSolid : $color.bg.neutralWeak,
      }}
    >
      <text
        style={{
          fontSize: "13px",
          color: active ? $color.fg.brandContrast : $color.fg.neutral,
          fontWeight: "bold",
        }}
      >
        {label}
      </text>
    </view>
  );
}

export function TagGroupPage() {
  const [size, setSize] = useState<Size>("t2");
  const [truncate, setTruncate] = useState(false);

  return (
    <scroll-view scroll-y style={{ display: "flex", flexDirection: "column", flex: 1 }}>
      <text style={{ fontSize: "20px", fontWeight: "bold" }}>TagGroup</text>

      <SectionHeader>Size</SectionHeader>
      <view style={{ display: "flex", flexDirection: "row", gap: "8px" }}>
        {(["t2", "t3", "t4"] as const).map((s) => (
          <Toggle key={s} label={s} active={size === s} onTap={() => setSize(s)} />
        ))}
      </view>

      <SectionHeader>Truncate</SectionHeader>
      <view style={{ display: "flex", flexDirection: "row", gap: "8px" }}>
        <Toggle label="off" active={!truncate} onTap={() => setTruncate(false)} />
        <Toggle label="on" active={truncate} onTap={() => setTruncate(true)} />
      </view>

      <SectionHeader>Default (neutralSubtle · regular)</SectionHeader>
      <TagGroupRoot size={size} truncate={truncate}>
        <TagGroupItem>
          <TagGroupItemLabel>동네 인증</TagGroupItemLabel>
        </TagGroupItem>
        <TagGroupItem>
          <TagGroupItemLabel>매너 온도 42.0°C</TagGroupItemLabel>
        </TagGroupItem>
        <TagGroupItem>
          <TagGroupItemLabel>재거래 희망률 89%</TagGroupItemLabel>
        </TagGroupItem>
      </TagGroupRoot>

      <SectionHeader>Weight: bold</SectionHeader>
      <TagGroupRoot size={size} weight="bold">
        <TagGroupItem>
          <TagGroupItemLabel>전체</TagGroupItemLabel>
        </TagGroupItem>
        <TagGroupItem>
          <TagGroupItemLabel>인기</TagGroupItemLabel>
        </TagGroupItem>
        <TagGroupItem>
          <TagGroupItemLabel>최신</TagGroupItemLabel>
        </TagGroupItem>
      </TagGroupRoot>

      <SectionHeader>Tone: neutral</SectionHeader>
      <TagGroupRoot size={size} tone="neutral">
        <TagGroupItem>
          <TagGroupItemLabel>새 상품</TagGroupItemLabel>
        </TagGroupItem>
        <TagGroupItem>
          <TagGroupItemLabel>배송비 포함</TagGroupItemLabel>
        </TagGroupItem>
      </TagGroupRoot>

      <SectionHeader>Tone: brand</SectionHeader>
      <TagGroupRoot size={size} tone="brand" weight="bold">
        <TagGroupItem>
          <TagGroupItemLabel>추천</TagGroupItemLabel>
        </TagGroupItem>
        <TagGroupItem>
          <TagGroupItemLabel>방금 등록</TagGroupItemLabel>
        </TagGroupItem>
      </TagGroupRoot>

      <SectionHeader>Per-item override</SectionHeader>
      <TagGroupRoot size={size}>
        <TagGroupItem tone="brand" weight="bold">
          <TagGroupItemLabel>NEW</TagGroupItemLabel>
        </TagGroupItem>
        <TagGroupItem>
          <TagGroupItemLabel>무료 나눔</TagGroupItemLabel>
        </TagGroupItem>
        <TagGroupItem tone="neutral">
          <TagGroupItemLabel>직거래 선호</TagGroupItemLabel>
        </TagGroupItem>
      </TagGroupRoot>

      <SectionHeader>Wrap example (toggle truncate)</SectionHeader>
      <TagGroupRoot size={size} truncate={truncate}>
        <TagGroupItem>
          <TagGroupItemLabel>관악구 봉천동</TagGroupItemLabel>
        </TagGroupItem>
        <TagGroupItem>
          <TagGroupItemLabel>재거래 희망 89%</TagGroupItemLabel>
        </TagGroupItem>
        <TagGroupItem>
          <TagGroupItemLabel>매너 온도 42.0°C</TagGroupItemLabel>
        </TagGroupItem>
        <TagGroupItem>
          <TagGroupItemLabel>평균 응답 12분</TagGroupItemLabel>
        </TagGroupItem>
        <TagGroupItem>
          <TagGroupItemLabel>판매자 인증 완료</TagGroupItemLabel>
        </TagGroupItem>
      </TagGroupRoot>

      <SectionHeader>Custom separator</SectionHeader>
      <TagGroupRoot size={size} separator=" / ">
        <TagGroupItem>
          <TagGroupItemLabel>서울</TagGroupItemLabel>
        </TagGroupItem>
        <TagGroupItem>
          <TagGroupItemLabel>관악구</TagGroupItemLabel>
        </TagGroupItem>
        <TagGroupItem>
          <TagGroupItemLabel>봉천동</TagGroupItemLabel>
        </TagGroupItem>
      </TagGroupRoot>
    </scroll-view>
  );
}
