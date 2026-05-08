import { radioVariantMap } from '@seed-design/lynx-css/recipes/radio';
import { radiomarkVariantMap } from '@seed-design/lynx-css/recipes/radiomark';
import { RadioGroup } from '@seed-design/lynx-react';

import { VariantCatalog } from '../components/variant-catalog.jsx';

export function RadioGroupPage() {
  return (
    <VariantCatalog variantMaps={[radioVariantMap, radiomarkVariantMap]}>
      {(v) => (
        <RadioGroup.Root
          weight={v.weight as 'regular' | 'bold'}
          size={v.size as 'medium' | 'large'}
          tone={v.tone as 'brand' | 'neutral'}
          disabled={Boolean(v.disabled)}
          defaultValue="option1"
        >
          {['option1', 'option2', 'option3'].map((value) => (
            <RadioGroup.Item key={value} value={value}>
              <RadioGroup.ItemControl>
                <RadioGroup.ItemIndicator />
              </RadioGroup.ItemControl>
              <RadioGroup.ItemLabel>
                Option {value.replace('option', '')}
              </RadioGroup.ItemLabel>
            </RadioGroup.Item>
          ))}
        </RadioGroup.Root>
      )}
    </VariantCatalog>
  );
}
