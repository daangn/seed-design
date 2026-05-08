/**
 * Generates icon page components from installed icon packages.
 *
 * Reads the lib/ directory of @karrotmarket/lynx-monochrome-icon and
 * @karrotmarket/lynx-multicolor-icon to discover available icons,
 * then generates corresponding page components.
 *
 * Usage: node scripts/generate-icon-pages.js
 */

import { readdirSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);

function isDigit(char) {
  return char >= '0' && char <= '9';
}

function isUppercaseLetter(char) {
  return char.toLowerCase() !== char && char.toUpperCase() === char;
}

function compareIconNames(a, b) {
  let aIndex = 0;
  let bIndex = 0;

  while (aIndex < a.length && bIndex < b.length) {
    const aChar = a[aIndex];
    const bChar = b[bIndex];

    if (isDigit(aChar) && isDigit(bChar)) {
      let aEnd = aIndex + 1;
      let bEnd = bIndex + 1;

      while (isDigit(a[aEnd])) aEnd += 1;
      while (isDigit(b[bEnd])) bEnd += 1;

      const numberDiff =
        Number(a.slice(aIndex, aEnd)) - Number(b.slice(bIndex, bEnd));
      if (numberDiff !== 0) return numberDiff;

      aIndex = aEnd;
      bIndex = bEnd;
      continue;
    }

    const aLower = aChar.toLowerCase();
    const bLower = bChar.toLowerCase();

    if (aLower !== bLower) {
      return aLower < bLower ? -1 : 1;
    }

    if (aChar !== bChar) {
      const aUpper = isUppercaseLetter(aChar);
      const bUpper = isUppercaseLetter(bChar);
      if (aUpper !== bUpper) return aUpper ? -1 : 1;

      return aChar < bChar ? -1 : 1;
    }

    aIndex += 1;
    bIndex += 1;
  }

  return a.length - b.length;
}

function getIconNames(packageName) {
  const entryPath = require.resolve(packageName);
  const libDir = dirname(entryPath);
  return readdirSync(libDir)
    .filter(
      (f) => f.endsWith('.js') && !f.endsWith('.cjs') && f.startsWith('Icon'),
    )
    .map((f) => f.replace('.js', ''))
    .sort(compareIconNames);
}

function generateMonochromePage(iconNames) {
  const imports = iconNames
    .map(
      (name) =>
        `import ${name} from '@karrotmarket/lynx-monochrome-icon/${name}';`,
    )
    .join('\n');

  const entries = iconNames
    .map((name) => {
      const label = name.replace(/^Icon/, '');
      return `  {
    component: ${name},
    name: '${label}',
  },`;
    })
    .join('\n');

  return `${imports}

import { vars } from '@seed-design/lynx-css/vars';
import {
  type IconEntry,
  VirtualIconGrid,
} from '../components/icon-virtual-grid.jsx';

const { $color } = vars;

const icons: IconEntry[] = [
${entries}
];

export function FoundationMonochromeIconPage() {
  return (
    <VirtualIconGrid
      title="Monochrome Icon"
      packageName="@karrotmarket/lynx-monochrome-icon"
      icons={icons}
      iconColor={$color.fg.neutral}
    />
  );
}
`;
}

function generateMulticolorPage(iconNames) {
  const imports = iconNames
    .map(
      (name) =>
        `import ${name} from '@karrotmarket/lynx-multicolor-icon/${name}';`,
    )
    .join('\n');

  const entries = iconNames
    .map((name) => {
      const label = name.replace(/^Icon/, '');
      return `  {
    component: ${name},
    name: '${label}',
  },`;
    })
    .join('\n');

  return `${imports}

import {
  type IconEntry,
  VirtualIconGrid,
} from '../components/icon-virtual-grid.jsx';

const icons: IconEntry[] = [
${entries}
];

export function FoundationMulticolorIconPage() {
  return (
    <VirtualIconGrid
      title="Multicolor Icon"
      packageName="@karrotmarket/lynx-multicolor-icon"
      icons={icons}
    />
  );
}
`;
}

const monoIcons = getIconNames('@karrotmarket/lynx-monochrome-icon');
const multiIcons = getIconNames('@karrotmarket/lynx-multicolor-icon');

const outDir = resolve(__dirname, '../src/pages');

writeFileSync(
  resolve(outDir, 'FoundationMonochromeIconPage.tsx'),
  generateMonochromePage(monoIcons),
);
console.log(
  `Generated FoundationMonochromeIconPage.tsx (${monoIcons.length} icons)`,
);

writeFileSync(
  resolve(outDir, 'FoundationMulticolorIconPage.tsx'),
  generateMulticolorPage(multiIcons),
);
console.log(
  `Generated FoundationMulticolorIconPage.tsx (${multiIcons.length} icons)`,
);
