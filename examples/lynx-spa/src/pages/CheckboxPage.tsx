import { useState } from '@lynx-js/react';
import { checkboxVariantMap } from '@seed-design/lynx-css/recipes/checkbox';
import { checkmarkVariantMap } from '@seed-design/lynx-css/recipes/checkmark';

import {
  CatalogExamples,
  CatalogSectionTitle,
} from '../components/catalog-examples.jsx';
import {
  definePreviewStates,
  defineVariantAxes,
  type SetVariantValue,
  VariantCatalog,
  type VariantCatalogValues,
} from '../components/variant-catalog.jsx';
import { Checkbox, CheckboxGroup, Checkmark } from '../seed-design/ui/checkbox';

const variants = defineVariantAxes([
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
]);

const previewStates = definePreviewStates([
  { key: 'checked', defaultValue: false },
  { key: 'indeterminate', defaultValue: false },
  { key: 'disabled', defaultValue: false },
]);

type CheckboxValues = VariantCatalogValues<
  typeof variants,
  typeof previewStates
>;

function renderCheckbox(
  values: CheckboxValues,
  setValue: SetVariantValue<CheckboxValues>,
) {
  return (
    <Checkbox
      label="Checkbox"
      weight={values.weight}
      size={values.size}
      tone={values.tone}
      variant={values.variant}
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
        <Checkbox
          label="Brand square"
          tone="brand"
          variant="square"
          defaultChecked
        />
        <Checkbox
          label="Neutral square"
          tone="neutral"
          variant="square"
          defaultChecked
        />
        <Checkbox
          label="Brand ghost"
          tone="brand"
          variant="ghost"
          defaultChecked
        />
        <Checkbox
          label="Neutral ghost"
          tone="neutral"
          variant="ghost"
          defaultChecked
        />
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
    <VariantCatalog
      variants={variants}
      previewStates={previewStates}
      examples={<CheckboxExamples />}
    >
      {(values, setValue) => renderCheckbox(values, setValue)}
    </VariantCatalog>
  );
}
