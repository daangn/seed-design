import * as t from 'tap';

import type { ColorToken, ColorScheme, KnownColorGroup } from '../src';
import { colors, parseColorToken } from '../src';

t.test('theme', async t => {
  type ColorStyle = [Token: ColorToken, Value: string];
  type ColorStyleMap = Record<KnownColorGroup, ColorStyle>;
  function toStyleMap(scheme: ColorScheme) {
    return Object.entries(scheme).reduce((acc, [k, v]) => {
      const [token, group] = parseColorToken(k);
      return {
        ...acc,
        [group]: [...acc[group] || [], [token, v]],
      };
    }, {} as ColorStyleMap);
  }

  t.test('light', async () => {
    t.matchSnapshot(toStyleMap(colors.light));
  });

  t.test('light', async () => {
    t.matchSnapshot(toStyleMap(colors.dark));
  });
});

t.test('validate', async () => {
  for (const token of Object.keys(colors.light)) {
    t.notThrow(() => parseColorToken(token));
  }
});

t.test('invalid values', async () => {
  t.throws(() => parseColorToken('a'));
  t.throws(() => parseColorToken('1213'));
  t.throws(() => parseColorToken('$asdf123'));
});
