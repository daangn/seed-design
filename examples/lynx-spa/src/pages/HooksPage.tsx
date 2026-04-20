import { useState } from '@lynx-js/react';
import { useControllableState, usePressTap } from '@seed-design/lynx-react';
import { vars } from '@seed-design/lynx-css/vars';

const { $color } = vars;

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <view style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <text style={{ fontSize: '16px', fontWeight: 'bold' }}>{title}</text>
      {children}
    </view>
  );
}

function Divider() {
  return (
    <view
      style={{
        height: '1px',
        backgroundColor: $color.stroke.neutralMuted,
        marginTop: '16px',
        marginBottom: '8px',
      }}
    />
  );
}

function UncontrollableToggle() {
  const [value, setValue] = useControllableState<boolean>({
    defaultValue: false,
    onChange: (v) => console.log('uncontrolled onChange:', v),
  });

  return (
    <view
      bindtap={() => setValue(!value)}
      style={{
        padding: '14px 16px',
        borderRadius: '8px',
        backgroundColor: value ? $color.bg.brandSolid : $color.bg.neutralWeak,
      }}
    >
      <text
        style={{
          fontSize: '14px',
          color: value ? $color.palette.staticWhite : $color.fg.neutral,
        }}
      >
        {`Uncontrolled — value: ${String(value)} (tap to toggle)`}
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
      console.log('controlled onChange:', v);
      setExternal(v);
    },
  });

  return (
    <view style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <view
        bindtap={() => setValue(!value)}
        style={{
          padding: '14px 16px',
          borderRadius: '8px',
          backgroundColor: value ? $color.bg.brandSolid : $color.bg.neutralWeak,
        }}
      >
        <text
          style={{
            fontSize: '14px',
            color: value ? $color.palette.staticWhite : $color.fg.neutral,
          }}
        >
          {`Controlled — value: ${String(value)} (tap to toggle)`}
        </text>
      </view>
      <view
        bindtap={() => setExternal(!external)}
        style={{
          padding: '10px 16px',
          borderRadius: '6px',
          backgroundColor: $color.bg.layerBasement,
          borderWidth: '1px',
          borderColor: $color.stroke.neutralMuted,
        }}
      >
        <text style={{ fontSize: '13px', color: $color.fg.neutral }}>
          {`External override — currently: ${String(external)} (tap to flip parent)`}
        </text>
      </view>
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
          'main thread';
          console.log('main thread tap fired');
        }
      : undefined,
  });

  const { pressed, ...handlers } = pressTap;
  const hasMainThread = 'main-thread:bindtap' in pressTap;

  return (
    <view
      {...handlers}
      style={{
        padding: '14px 16px',
        borderRadius: '8px',
        backgroundColor: disabled
          ? $color.bg.layerBasement
          : pressed
            ? $color.bg.brandSolidPressed
            : $color.bg.brandSolid,
        opacity: disabled ? '0.5' : '1',
      }}
    >
      <text
        style={{
          fontSize: '14px',
          fontWeight: 'bold',
          color: disabled
            ? $color.fg.neutralSubtle
            : $color.palette.staticWhite,
        }}
      >
        {label}
      </text>
      <text
        style={{
          fontSize: '12px',
          color: disabled
            ? $color.fg.neutralSubtle
            : $color.palette.staticWhite,
          marginTop: '4px',
        }}
      >
        {`pressed: ${String(pressed)} · taps: ${tapCount} · main-thread:bindtap: ${String(hasMainThread)}`}
      </text>
    </view>
  );
}

export function HooksPage() {
  return (
    <scroll-view
      scroll-y
      style={{ display: 'flex', flexDirection: 'column', gap: '16px', flex: 1 }}
    >
      <text style={{ fontSize: '20px', fontWeight: 'bold' }}>Hooks</text>

      <Section title="useControllableState (uncontrolled)">
        <UncontrollableToggle />
        <text style={{ fontSize: '12px', color: $color.fg.neutralSubtle }}>
          value가 제공되지 않아 훅 내부 상태로 동작. onChange는 값이 실제 바뀔
          때만 호출.
        </text>
      </Section>

      <Section title="useControllableState (controlled)">
        <ControlledToggle />
        <text style={{ fontSize: '12px', color: $color.fg.neutralSubtle }}>
          부모의 value를 따르고, setValue는 onChange만 호출. 부모 탭도 반영됨.
        </text>
      </Section>

      <Divider />

      <Section title="usePressTap (basic)">
        <PressTapDemo label="Press me" />
        <text style={{ fontSize: '12px', color: $color.fg.neutralSubtle }}>
          touchstart 시 pressed=true, touchend/cancel 시 pressed=false.
        </text>
      </Section>

      <Section title="usePressTap (disabled)">
        <PressTapDemo label="Disabled" disabled />
        <text style={{ fontSize: '12px', color: $color.fg.neutralSubtle }}>
          disabled=true일 때 pressed 변화와 onTap 호출이 차단됨.
        </text>
      </Section>

      <Section title="usePressTap (with main-thread:bindtap)">
        <PressTapDemo label="Main thread ready" withMainThread />
        <text style={{ fontSize: '12px', color: $color.fg.neutralSubtle }}>
          mainThreadOnTap 제공 시 `main-thread:bindtap` 포함. 콘솔 로그 확인.
        </text>
      </Section>
    </scroll-view>
  );
}
