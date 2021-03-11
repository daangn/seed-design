import * as t from 'tap';

import { light, parseToken, toStyleMap } from '../src/colors';

t.test('color set', async () => {
  t.matchSnapshot(toStyleMap(light));
});

t.test('validate', async () => {
  for (const token of Object.keys(light)) {
    t.notThrow(() => parseToken(token));
  }
});

t.test('invalid values', async () => {
  t.throws(() => parseToken('a'));
  t.throws(() => parseToken('1213'));
  t.throws(() => parseToken('$asdf123'));
});
