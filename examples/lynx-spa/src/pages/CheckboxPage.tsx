import { checkboxVariantMap } from '@seed-design/lynx-css/recipes/checkbox';
import { checkmarkVariantMap } from '@seed-design/lynx-css/recipes/checkmark';

import {
  VariantCatalog,
  type SetVariantValue,
  type VariantAxis,
  type VariantValues,
} from '../components/variant-catalog.jsx';
import { Checkbox, type CheckboxProps } from '../seed-design/ui/checkbox';

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

export function CheckboxPage() {
  return (
    <VariantCatalog variants={variants}>
      {(values, setValue) => renderCheckbox(values, setValue)}
    </VariantCatalog>
  );
}
