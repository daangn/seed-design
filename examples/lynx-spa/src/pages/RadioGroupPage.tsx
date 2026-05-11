import { radioVariantMap } from '@seed-design/lynx-css/recipes/radio';
import { radiomarkVariantMap } from '@seed-design/lynx-css/recipes/radiomark';

import {
  type PreviewState,
  type SetVariantValue,
  type VariantAxis,
  VariantCatalog,
  type VariantValues,
} from '../components/variant-catalog.jsx';
import {
  RadioGroup,
  RadioGroupItem,
  type RadioGroupProps,
} from '../seed-design/ui/radio-group';

type RadioWeight = NonNullable<RadioGroupProps['weight']>;
type RadioSize = NonNullable<RadioGroupProps['size']>;
type RadioTone = NonNullable<RadioGroupProps['tone']>;

const variants: readonly VariantAxis[] = [
  {
    key: 'weight',
    options: radioVariantMap.weight,
    defaultValue: 'regular',
  },
  {
    key: 'size',
    options: radioVariantMap.size,
    defaultValue: 'medium',
  },
  {
    key: 'tone',
    options: radiomarkVariantMap.tone,
    defaultValue: 'brand',
  },
  {
    key: 'disabled',
    options: radioVariantMap.disabled,
    defaultValue: false,
  },
];

const previewStates: readonly PreviewState[] = [
  { key: 'value', defaultValue: 'option1' },
];

function renderRadioGroup(values: VariantValues, setValue: SetVariantValue) {
  const selectedValue = values.value as string;

  return (
    <RadioGroup
      weight={values.weight as RadioWeight}
      size={values.size as RadioSize}
      tone={values.tone as RadioTone}
      disabled={Boolean(values.disabled)}
      value={selectedValue}
      onValueChange={(next) => setValue('value', next)}
    >
      {['option1', 'option2', 'option3'].map((value) => (
        <RadioGroupItem
          key={value}
          value={value}
          label={`Option ${value.replace('option', '')}`}
        />
      ))}
    </RadioGroup>
  );
}

export function RadioGroupPage() {
  return (
    <VariantCatalog variants={variants} previewStates={previewStates}>
      {(values, setValue) => renderRadioGroup(values, setValue)}
    </VariantCatalog>
  );
}
