import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { expect, test } from 'vitest';

const currentDir = dirname(fileURLToPath(import.meta.url));
const source = readFileSync(join(currentDir, 'SafeAreaDebugPage.tsx'), 'utf8');

test('SafeAreaDebugPage keeps only essential safe area diagnostics', () => {
  expect(source).not.toContain('useState');
  expect(source).not.toContain('Refresh raw values');
  expect(source).not.toContain('keys');
  expect(source).not.toContain('top source');
  expect(source).not.toContain('bottom source');
  expect(source).not.toContain('+ 16px base');
  expect(source).toContain('safeAreaInsetTop');
  expect(source).toContain('safeAreaInsetBottom');
  expect(source).toContain('useSafeArea().top');
  expect(source).toContain('useSafeArea().bottom');
});
