import {
  RadioGroupItem,
  RadioGroupItemControl,
  RadioGroupItemIndicator,
  RadioGroupItemLabel,
  RadioGroupRoot,
} from '@seed-design/lynx-react';
import { radioVariantMap } from '@seed-design/lynx-css/recipes/radio';
import { radiomarkVariantMap } from '@seed-design/lynx-css/recipes/radiomark';

import { VariantCatalog } from '../components/variant-catalog.jsx';

export function RadioGroupPage() {
  return (
    <VariantCatalog variantMaps={[radioVariantMap, radiomarkVariantMap]}>
      {(v) => (
        <RadioGroupRoot
          weight={v.weight as 'regular' | 'bold'}
          size={v.size as 'medium' | 'large'}
          tone={v.tone as 'brand' | 'neutral'}
          disabled={Boolean(v.disabled)}
          defaultValue="option1"
        >
          {['option1', 'option2', 'option3'].map((value) => (
            <RadioGroupItem key={value} value={value}>
              <RadioGroupItemControl>
                <RadioGroupItemIndicator />
              </RadioGroupItemControl>
              <RadioGroupItemLabel>
                Option {value.replace('option', '')}
              </RadioGroupItemLabel>
            </RadioGroupItem>
          ))}
        </RadioGroupRoot>
      )}
    </VariantCatalog>
  );
}
