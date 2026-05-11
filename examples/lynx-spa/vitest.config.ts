import { defineConfig, mergeConfig } from 'vitest/config';
import { createVitestConfig } from '@lynx-js/react/testing-library/vitest-config';

const defaultConfig = await createVitestConfig();
const config = defineConfig({
  test: {
    include: ['src/**/*.test.{ts,tsx}', 'src/**/*.vitest.{ts,tsx}'],
  },
});

export default mergeConfig(defaultConfig, config);
