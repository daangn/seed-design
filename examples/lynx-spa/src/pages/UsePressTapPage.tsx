import { useState } from "@lynx-js/react";
import { usePressTap } from "@seed-design/lynx-react";
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

function PressTapDemo({
  label,
  disabled,
  withMainThread,
}: {
  label: string;
  disabled?: boolean;
  withMainThread?: boolean;
}) {
  const [tapCount, setTapCount] = useState(0);

  const pressTap = usePressTap({
    disabled,
    onTap: () => setTapCount((c) => c + 1),
    mainThreadOnTap: withMainThread
      ? () => {
          "main thread";
          console.log("main thread tap fired");
        }
      : undefined,
  });

  const { pressed, ...handlers } = pressTap;
  const hasMainThread = "main-thread:bindtap" in pressTap;

  return (
    <view
      {...handlers}
      style={{
        padding: "14px 16px",
        borderRadius: "8px",
        backgroundColor: disabled
          ? $color.bg.layerBasement
          : pressed
            ? $color.bg.brandSolidPressed
            : $color.bg.brandSolid,
        opacity: disabled ? "0.5" : "1",
      }}
    >
      <text
        style={{
          fontSize: "14px",
          fontWeight: "bold",
          color: disabled ? $color.fg.neutralSubtle : $color.palette.staticWhite,
        }}
      >
        {label}
      </text>
      <text
        style={{
          fontSize: "12px",
          color: disabled ? $color.fg.neutralSubtle : $color.palette.staticWhite,
          marginTop: "4px",
        }}
      >
        {`pressed: ${String(pressed)} · taps: ${tapCount} · main-thread:bindtap: ${String(hasMainThread)}`}
      </text>
    </view>
  );
}

export function UsePressTapPage() {
  return (
    <scroll-view
      scroll-y
      style={{ display: "flex", flexDirection: "column", gap: "16px", flex: 1 }}
    >
      <text style={{ fontSize: "20px", fontWeight: "bold" }}>usePressTap</text>

      <Section title="Basic">
        <PressTapDemo label="Press me" />
        <text style={{ fontSize: "12px", color: $color.fg.neutralSubtle }}>
          touchstart 시 pressed=true, touchend/cancel 시 pressed=false. 탭 시
          onTap 호출.
        </text>
      </Section>

      <Section title="Disabled">
        <PressTapDemo label="Disabled" disabled />
        <text style={{ fontSize: "12px", color: $color.fg.neutralSubtle }}>
          disabled=true일 때 pressed 변화와 onTap 호출이 차단됨.
        </text>
      </Section>

      <Section title="With main-thread:bindtap">
        <PressTapDemo label="Main thread ready" withMainThread />
        <text style={{ fontSize: "12px", color: $color.fg.neutralSubtle }}>
          mainThreadOnTap 제공 시 `main-thread:bindtap` 반환 객체에 포함. 콘솔
          로그 확인.
        </text>
      </Section>
    </scroll-view>
  );
}
