import { useState } from '@lynx-js/react';
import { checkboxVariantMap } from '@seed-design/lynx-css/recipes/checkbox';
import { checkmarkVariantMap } from '@seed-design/lynx-css/recipes/checkmark';

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
import {
  Checkbox,
  CheckboxGroup,
  Checkmark,
  type CheckboxProps,
} from '../seed-design/ui/checkbox';

type CheckboxWeight = NonNullable<CheckboxProps['weight']>;
type CheckboxSize = NonNullable<CheckboxProps['size']>;
type CheckboxTone = NonNullable<CheckboxProps['tone']>;
type CheckboxVariant = NonNullable<CheckboxProps['variant']>;

const variants: readonly VariantAxis[] = [
  {
    key: 'weight',
    options: checkboxVariantMap.weight,
    defaultValue: 'regular',
  },
  {
    key: 'size',
    options: checkboxVariantMap.size,
    defaultValue: 'medium',
  },
  {
    key: 'disabled',
    options: checkboxVariantMap.disabled,
    defaultValue: false,
  },
  {
    key: 'variant',
    options: checkmarkVariantMap.variant,
    defaultValue: 'square',
  },
  {
    key: 'tone',
    options: checkmarkVariantMap.tone,
    defaultValue: 'brand',
  },
  {
    key: 'checked',
    options: checkmarkVariantMap.checked,
    defaultValue: false,
  },
  {
    key: 'indeterminate',
    options: checkmarkVariantMap.indeterminate,
    defaultValue: false,
  },
];

function renderCheckbox(values: VariantValues, setValue: SetVariantValue) {
  return (
    <Checkbox
      label="Checkbox"
      weight={values.weight as CheckboxWeight}
      size={values.size as CheckboxSize}
      tone={values.tone as CheckboxTone}
      variant={values.variant as CheckboxVariant}
      checked={Boolean(values.checked)}
      indeterminate={Boolean(values.indeterminate)}
      disabled={Boolean(values.disabled)}
      onCheckedChange={(next) => setValue('checked', next)}
    />
  );
}

function CheckboxExamples() {
  const [controlled, setControlled] = useState(false);
  const [indeterminateChecked, setIndeterminateChecked] = useState(false);
  const [indeterminate, setIndeterminate] = useState(true);

  return (
    <CatalogExamples title="Checkbox" gap="12px">
      <CatalogSectionTitle>Default (uncontrolled)</CatalogSectionTitle>
      <view
        style={{
          display: 'flex',
          flexDirection: 'row',
          gap: '16px',
          alignItems: 'center',
        }}
      >
        <Checkmark />
        <Checkmark defaultChecked />
        <Checkmark variant="ghost" defaultChecked />
      </view>

      <CatalogSectionTitle>With Label</CatalogSectionTitle>
      <CheckboxGroup>
        <Checkbox label="채팅 알림" defaultChecked />
        <Checkbox label="관심 키워드 알림" />
        <Checkbox label="마케팅 정보 수신" />
      </CheckboxGroup>

      <CatalogSectionTitle>Controlled</CatalogSectionTitle>
      <Checkbox
        label={controlled ? '선택됨' : '선택 안 됨'}
        checked={controlled}
        onCheckedChange={setControlled}
      />

      <CatalogSectionTitle>Indeterminate</CatalogSectionTitle>
      <Checkbox
        label="전체 선택"
        checked={indeterminateChecked}
        indeterminate={indeterminate}
        onCheckedChange={(next) => {
          setIndeterminateChecked(next);
          setIndeterminate(false);
        }}
      />

      <CatalogSectionTitle>Tones and Variants</CatalogSectionTitle>
      <CheckboxGroup>
        <Checkbox label="Brand square" tone="brand" variant="square" defaultChecked />
        <Checkbox label="Neutral square" tone="neutral" variant="square" defaultChecked />
        <Checkbox label="Brand ghost" tone="brand" variant="ghost" defaultChecked />
        <Checkbox label="Neutral ghost" tone="neutral" variant="ghost" defaultChecked />
      </CheckboxGroup>

      <CatalogSectionTitle>Disabled</CatalogSectionTitle>
      <CheckboxGroup>
        <Checkbox label="Disabled Off" disabled />
        <Checkbox label="Disabled On" disabled defaultChecked />
      </CheckboxGroup>
    </CatalogExamples>
  );
}

export function CheckboxPage() {
  return (
    <VariantCatalog variants={variants} examples={<CheckboxExamples />}>
      {(values, setValue) => renderCheckbox(values, setValue)}
    </VariantCatalog>
  );
}
