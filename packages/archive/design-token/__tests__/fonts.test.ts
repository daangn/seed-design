import * as t from 'tap';

import { fonts } from '../src';

t.test('fonts scheme - default', async t => {
  t.matchSnapshot(fonts.default.scheme);
});

t.test('semantic fonts scheme - default', async t => {
  t.matchSnapshot(fonts.default.semanticScheme);
});
