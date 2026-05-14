import { defineConfig, mergeConfig } from 'vitest/config';
import { createVitestConfig } from '@lynx-js/react/testing-library/vitest-config';
import { transformReactLynxSync } from '@lynx-js/react/transform';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const defaultConfig = await createVitestConfig();
const configRoot = fileURLToPath(new URL('.', import.meta.url));
const reactPackageUrl = import.meta.resolve('@lynx-js/react/package.json');
const reactPackageRootUrl = new URL('.', reactPackageUrl);
const preactRoot = fileURLToPath(new URL('../../preact', reactPackageRootUrl));
const preactAliases = [
  { find: 'preact', replacement: preactRoot },
  { find: 'preact/hooks', replacement: `${preactRoot}/hooks` },
  { find: 'preact/compat', replacement: `${preactRoot}/compat` },
  { find: 'preact/test-utils', replacement: `${preactRoot}/test-utils` },
  { find: 'preact/jsx-runtime', replacement: `${preactRoot}/jsx-runtime` },
  { find: 'preact/jsx-dev-runtime', replacement: `${preactRoot}/jsx-dev-runtime` },
];
const inlineLynxTestDeps = [
  '@lynx-js/motion',
  '@karrotmarket/lynx-monochrome-icon',
  '@karrotmarket/lynx-multicolor-icon',
  '@karrotmarket/assets-monochrome',
  '@karrotmarket/assets-multicolor',
];

function normalizeSlashes(file: string) {
  return file.replaceAll(path.win32.sep, '/');
}

const config = defineConfig({
  plugins: [
    {
      name: 'transform-lynx-icon-jsx',
      enforce: 'pre',
      transform(code, id) {
        if (
          /@karrotmarket[+/]lynx-(monochrome|multicolor)-icon/.test(id) &&
          id.endsWith('.js')
        ) {
          const relativePath = normalizeSlashes(path.relative(configRoot, id));
          const result = transformReactLynxSync(code, {
            mode: 'test',
            pluginName: '',
            filename: path.basename(id),
            sourcemap: true,
            snapshot: {
              preserveJsx: false,
              runtimePkg: '@lynx-js/react/internal',
              jsxImportSource: '@lynx-js/react',
              filename: relativePath,
              target: 'MIXED',
            },
            engineVersion: '',
            dynamicImport: {
              injectLazyBundle: false,
              layer: 'test',
              runtimePkg: '@lynx-js/react/internal',
            },
            directiveDCE: false,
            defineDCE: false,
            shake: false,
            compat: false,
            worklet: {
              filename: relativePath,
              runtimePkg: '@lynx-js/react/internal',
              target: 'MIXED',
            },
            refresh: false,
            cssScope: false,
          });

          if (result.errors.length > 0) {
            result.errors.forEach((error) => {
              this.error(error.text ?? 'Lynx icon transform failed.');
            });
          }

          if (result.warnings.length > 0) {
            result.warnings.forEach((warning) => {
              this.warn(warning.text ?? 'Lynx icon transform warning.');
            });
          }

          return {
            code: result.code,
            map: result.map,
          };
        }
      },
    },
  ],
  resolve: {
    alias: preactAliases,
  },
  test: {
    include: ['src/**/*.test.{ts,tsx}', 'src/**/*.vitest.{ts,tsx}'],
    server: {
      deps: {
        inline: inlineLynxTestDeps,
      },
    },
  },
  optimizeDeps: {
    exclude: ['@lynx-js/react', 'preact', 'preact/hooks', 'preact/compat'],
  },
  ssr: {
    noExternal: [
      '@lynx-js/react',
      'preact',
      '@lynx-js/internal-preact',
      ...inlineLynxTestDeps,
    ],
  },
});

export default mergeConfig(defaultConfig, config);
