import { useState } from '@lynx-js/react';
import { Switch as SeedSwitch } from '@seed-design/lynx-react';
import { switchVariantMap } from '@seed-design/lynx-css/recipes/switch';
import { switchmarkVariantMap } from '@seed-design/lynx-css/recipes/switchmark';

import {
  VariantCatalog,
  type SetVariantValue,
  type VariantAxis,
  type VariantValues,
} from '../components/variant-catalog.jsx';
import { Switch, Switchmark, type SwitchProps } from '../seed-design/ui/switch';

type SwitchSize = NonNullable<SwitchProps['size']>;
type SwitchTone = NonNullable<SwitchProps['tone']>;

const variants: readonly VariantAxis[] = [
  {
    key: 'size',
    options: switchVariantMap.size,
    defaultValue: '32',
  },
  {
    key: 'tone',
    options: switchmarkVariantMap.tone,
    defaultValue: 'brand',
  },
  {
    key: 'checked',
    options: switchmarkVariantMap.checked,
    defaultValue: false,
  },
  {
    key: 'disabled',
    options: switchVariantMap.disabled,
    defaultValue: false,
  },
];

function renderSwitch(values: VariantValues, setValue: SetVariantValue) {
  const checked = Boolean(values.checked);
  return (
    <Switch
      label={checked ? 'On' : 'Off'}
      size={values.size as SwitchSize}
      tone={values.tone as SwitchTone}
      checked={checked}
      disabled={Boolean(values.disabled)}
      onCheckedChange={(next) => setValue('checked', next)}
    />
  );
}

function SectionTitle({ children }: { children: string }) {
  return (
    <text style={{ fontSize: '16px', fontWeight: 'bold', marginTop: '8px' }}>
      {children}
    </text>
  );
}

function SwitchExamples() {
  const [controlled, setControlled] = useState(false);

  return (
    <scroll-view
      scroll-y
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        flex: 1,
        padding: '16px',
      }}
    >
      <text style={{ fontSize: '20px', fontWeight: 'bold' }}>Switch</text>

      <SectionTitle>Default (uncontrolled)</SectionTitle>
      <view
        style={{
          display: 'flex',
          flexDirection: 'row',
          gap: '16px',
          alignItems: 'center',
        }}
      >
        <Switchmark />
        <Switchmark defaultChecked />
      </view>

      <SectionTitle>With Label</SectionTitle>
      <view style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <Switch label="알림 받기" defaultChecked />
        <Switch label="자동 로그인" />
      </view>

      <SectionTitle>Controlled</SectionTitle>
      <view
        style={{
          display: 'flex',
          flexDirection: 'row',
          gap: '16px',
          alignItems: 'center',
        }}
      >
        <Switch
          label={controlled ? 'On' : 'Off'}
          checked={controlled}
          onCheckedChange={setControlled}
        />
      </view>

      <SectionTitle>Sizes</SectionTitle>
      <view
        style={{
          display: 'flex',
          flexDirection: 'row',
          gap: '16px',
          alignItems: 'center',
        }}
      >
        <Switchmark size="16" defaultChecked />
        <Switchmark size="24" defaultChecked />
        <Switchmark size="32" defaultChecked />
      </view>

      <SectionTitle>Tones</SectionTitle>
      <view
        style={{
          display: 'flex',
          flexDirection: 'row',
          gap: '16px',
          alignItems: 'center',
        }}
      >
        <Switch label="Brand" tone="brand" defaultChecked />
        <Switch label="Neutral" tone="neutral" defaultChecked />
      </view>

      <SectionTitle>Disabled</SectionTitle>
      <view style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <Switch label="Disabled Off" disabled />
        <Switch label="Disabled On" disabled defaultChecked />
      </view>

      <text style={{ fontSize: '16px', fontWeight: 'bold', marginTop: '8px' }}>
        Compound: Control override (Root=brand, Control=neutral)
      </text>
      <view
        style={{
          display: 'flex',
          flexDirection: 'row',
          gap: '16px',
          alignItems: 'center',
        }}
      >
        <SeedSwitch.Root tone="brand" defaultChecked>
          <SeedSwitch.Control tone="neutral">
            <SeedSwitch.Thumb />
          </SeedSwitch.Control>
          <SeedSwitch.Label>Override</SeedSwitch.Label>
        </SeedSwitch.Root>
      </view>
    </scroll-view>
  );
}

export function SwitchPage() {
  return (
    <VariantCatalog variants={variants} examples={<SwitchExamples />}>
      {(values, setValue) => renderSwitch(values, setValue)}
    </VariantCatalog>
  );
}
