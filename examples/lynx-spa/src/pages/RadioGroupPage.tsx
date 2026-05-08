import { radioVariantMap } from '@seed-design/lynx-css/recipes/radio';
import { radiomarkVariantMap } from '@seed-design/lynx-css/recipes/radiomark';

import {
  VariantCatalog,
  type VariantAxis,
  type VariantValues,
} from '../components/variant-catalog.jsx';
import {
  Radio,
  RadioGroup,
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

function renderRadioGroup(values: VariantValues) {
  return (
    <RadioGroup
      weight={values.weight as RadioWeight}
      size={values.size as RadioSize}
      tone={values.tone as RadioTone}
      disabled={Boolean(values.disabled)}
      defaultValue="option1"
    >
      {['option1', 'option2', 'option3'].map((value) => (
        <Radio
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
    <VariantCatalog variants={variants}>
      {(values) => renderRadioGroup(values)}
    </VariantCatalog>
  );
}
