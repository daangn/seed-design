import { useState } from '@lynx-js/react';
import {
  SwitchControl,
  SwitchLabel,
  SwitchRoot,
  SwitchThumb,
} from '@seed-design/lynx-react';
import { switchVariantMap } from '@seed-design/lynx-css/recipes/switch';
import { switchmarkVariantMap } from '@seed-design/lynx-css/recipes/switchmark';

import {
  CatalogExamples,
  CatalogSectionTitle,
} from '../components/catalog-examples.jsx';
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

function SwitchExamples() {
  const [controlled, setControlled] = useState(false);

  return (
    <CatalogExamples title="Switch" gap="12px">
      <CatalogSectionTitle>Default (uncontrolled)</CatalogSectionTitle>
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

      <CatalogSectionTitle>With Label</CatalogSectionTitle>
      <view style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <Switch label="알림 받기" defaultChecked />
        <Switch label="자동 로그인" />
      </view>

      <CatalogSectionTitle>Controlled</CatalogSectionTitle>
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

      <CatalogSectionTitle>Sizes</CatalogSectionTitle>
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

      <CatalogSectionTitle>Tones</CatalogSectionTitle>
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

      <CatalogSectionTitle>Disabled</CatalogSectionTitle>
      <view style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <Switch label="Disabled Off" disabled />
        <Switch label="Disabled On" disabled defaultChecked />
      </view>

      <CatalogSectionTitle>Compound: Control override</CatalogSectionTitle>
      <view
        style={{
          display: 'flex',
          flexDirection: 'row',
          gap: '16px',
          alignItems: 'center',
        }}
      >
        <SwitchRoot tone="brand" defaultChecked>
          <SwitchControl tone="neutral">
            <SwitchThumb />
          </SwitchControl>
          <SwitchLabel>Override</SwitchLabel>
        </SwitchRoot>
      </view>
    </CatalogExamples>
  );
}

export function SwitchPage() {
  return (
    <VariantCatalog variants={variants} examples={<SwitchExamples />}>
      {(values, setValue) => renderSwitch(values, setValue)}
    </VariantCatalog>
  );
}
