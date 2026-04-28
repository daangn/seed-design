import IconCheckmarkFatFill from '@karrotmarket/lynx-monochrome-icon/IconCheckmarkFatFill';
import IconMinusFatFill from '@karrotmarket/lynx-monochrome-icon/IconMinusFatFill';
import { checkboxVariantMap } from '@seed-design/lynx-css/recipes/checkbox';
import { checkmarkVariantMap } from '@seed-design/lynx-css/recipes/checkmark';
import {
  CheckboxControl,
  CheckboxIndicator,
  CheckboxLabel,
  CheckboxRoot,
} from '@seed-design/lynx-react';

import { VariantCatalog } from '../components/variant-catalog.jsx';

export function CheckboxPage() {
  return (
    <VariantCatalog variantMaps={[checkboxVariantMap, checkmarkVariantMap]}>
      {(v, setValue) => (
        <CheckboxRoot
          weight={v.weight as 'regular' | 'bold'}
          size={v.size as 'medium' | 'large'}
          tone={v.tone as 'brand' | 'neutral'}
          variant={v.variant as 'square' | 'ghost'}
          checked={Boolean(v.checked)}
          indeterminate={Boolean(v.indeterminate)}
          disabled={Boolean(v.disabled)}
          onCheckedChange={(next) => setValue('checked', next)}
        >
          <CheckboxControl>
            <CheckboxIndicator
              unchecked={<IconCheckmarkFatFill />}
              checked={<IconCheckmarkFatFill />}
              indeterminate={<IconMinusFatFill />}
            />
          </CheckboxControl>
          <CheckboxLabel>Checkbox</CheckboxLabel>
        </CheckboxRoot>
      )}
    </VariantCatalog>
  );
}
