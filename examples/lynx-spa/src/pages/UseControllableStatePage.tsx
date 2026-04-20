import { useState } from "@lynx-js/react";
import { useControllableState } from "@seed-design/lynx-react";
import { vars } from "@seed-design/lynx-css/vars";

const { $color } = vars;

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <view style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
      <text style={{ fontSize: "16px", fontWeight: "bold" }}>{title}</text>
      {children}
    </view>
  );
}

function UncontrollableToggle() {
  const [value, setValue] = useControllableState<boolean>({
    defaultValue: false,
    onChange: (v) => console.log("uncontrolled onChange:", v),
  });

  return (
    <view
      bindtap={() => setValue(!value)}
      style={{
        padding: "14px 16px",
        borderRadius: "8px",
        backgroundColor: value ? $color.bg.brandSolid : $color.bg.neutralWeak,
      }}
    >
      <text
        style={{
          fontSize: "14px",
          color: value ? $color.palette.staticWhite : $color.fg.neutral,
        }}
      >
        {`value: ${String(value)} (tap to toggle)`}
      </text>
    </view>
  );
}

function ControlledToggle() {
  const [external, setExternal] = useState<boolean>(false);
  const [value, setValue] = useControllableState<boolean>({
    value: external,
    defaultValue: false,
    onChange: (v) => {
      console.log("controlled onChange:", v);
      setExternal(v);
    },
  });

  return (
    <view style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
      <view
        bindtap={() => setValue(!value)}
        style={{
          padding: "14px 16px",
          borderRadius: "8px",
          backgroundColor: value ? $color.bg.brandSolid : $color.bg.neutralWeak,
        }}
      >
        <text
          style={{
            fontSize: "14px",
            color: value ? $color.palette.staticWhite : $color.fg.neutral,
          }}
        >
          {`value: ${String(value)} (tap to toggle)`}
        </text>
      </view>
      <view
        bindtap={() => setExternal(!external)}
        style={{
          padding: "10px 16px",
          borderRadius: "6px",
          backgroundColor: $color.bg.layerBasement,
          borderWidth: "1px",
          borderColor: $color.stroke.neutralMuted,
        }}
      >
        <text style={{ fontSize: "13px", color: $color.fg.neutral }}>
          {`External override: ${String(external)} (tap to flip parent state)`}
        </text>
      </view>
    </view>
  );
}

export function UseControllableStatePage() {
  return (
    <scroll-view
      scroll-y
      style={{ display: "flex", flexDirection: "column", gap: "16px", flex: 1 }}
    >
      <text style={{ fontSize: "20px", fontWeight: "bold" }}>
        useControllableState
      </text>

      <Section title="Uncontrolled">
        <UncontrollableToggle />
        <text style={{ fontSize: "12px", color: $color.fg.neutralSubtle }}>
          value가 제공되지 않아 훅 내부 state로 동작. onChange는 값이 실제 바뀔
          때만 호출 (동일 값으로 setValue 시 skip).
        </text>
      </Section>

      <Section title="Controlled">
        <ControlledToggle />
        <text style={{ fontSize: "12px", color: $color.fg.neutralSubtle }}>
          부모의 value를 따르고 setValue는 onChange만 호출. 부모 state를 외부에서
          바꿔도 반영됨.
        </text>
      </Section>
    </scroll-view>
  );
}
