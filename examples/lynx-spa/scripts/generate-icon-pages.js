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
import { resolve, dirname } from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);

function getIconNames(packageName) {
  const entryPath = require.resolve(packageName);
  const libDir = dirname(entryPath);
  return readdirSync(libDir)
    .filter(
      (f) => f.endsWith('.js') && !f.endsWith('.cjs') && f.startsWith('Icon'),
    )
    .map((f) => f.replace('.js', ''))
    .sort();
}

function generateMonochromePage(iconNames) {
  const imports = iconNames
    .map(
      (name) =>
        `import ${name} from "@karrotmarket/lynx-monochrome-icon/${name}";`,
    )
    .join('\n');

  const entries = iconNames
    .map((name) => {
      const label = name.replace(/^Icon/, '');
      return `  { component: ${name}, name: "${label}" },`;
    })
    .join('\n');

  return `import { vars } from "@seed-design/css/vars";

${imports}

const { $color } = vars;

interface IconEntry {
  component: (props: { size?: number; color: string }) => JSX.Element;
  name: string;
}

const icons: IconEntry[] = [
${entries}
];

export function FoundationMonochromeIconPage() {
  return (
    <scroll-view scroll-y style={{ display: "flex", flexDirection: "column", flex: 1 }}>
      <text style={{ fontSize: "20px", fontWeight: "bold" }}>Monochrome Icon</text>
      <text
        style={{
          fontSize: "13px",
          color: $color.fg.neutralSubtle,
          marginBottom: "8px",
        }}
      >
        @karrotmarket/lynx-monochrome-icon — {icons.length} icons
      </text>

      <view
        style={{
          display: "flex",
          flexDirection: "row",
          flexWrap: "wrap",
          gap: "4px",
        }}
      >
        {icons.map(({ component: IconComp, name }) => (
          <view
            key={name}
            style={{
              width: "80px",
              padding: "8px 4px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "4px",
            }}
          >
            <IconComp size={24} color={$color.fg.neutral} />
            <text
              style={{
                fontSize: "9px",
                color: $color.fg.neutralMuted,
                textAlign: "center",
                wordBreak: "break-all",
              }}
            >
              {name}
            </text>
          </view>
        ))}
      </view>
    </scroll-view>
  );
}
`;
}

function generateMulticolorPage(iconNames) {
  const imports = iconNames
    .map(
      (name) =>
        `import ${name} from "@karrotmarket/lynx-multicolor-icon/${name}";`,
    )
    .join('\n');

  const entries = iconNames
    .map((name) => {
      const label = name.replace(/^Icon/, '');
      return `  { component: ${name}, name: "${label}" },`;
    })
    .join('\n');

  return `import { vars } from "@seed-design/css/vars";

${imports}

const { $color } = vars;

interface IconEntry {
  component: (props: { size?: number }) => JSX.Element;
  name: string;
}

const icons: IconEntry[] = [
${entries}
];

export function FoundationMulticolorIconPage() {
  return (
    <scroll-view scroll-y style={{ display: "flex", flexDirection: "column", flex: 1 }}>
      <text style={{ fontSize: "20px", fontWeight: "bold" }}>Multicolor Icon</text>
      <text
        style={{
          fontSize: "13px",
          color: $color.fg.neutralSubtle,
          marginBottom: "8px",
        }}
      >
        @karrotmarket/lynx-multicolor-icon — {icons.length} icons
      </text>

      <view
        style={{
          display: "flex",
          flexDirection: "row",
          flexWrap: "wrap",
          gap: "4px",
        }}
      >
        {icons.map(({ component: IconComp, name }) => (
          <view
            key={name}
            style={{
              width: "80px",
              padding: "8px 4px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "4px",
            }}
          >
            <IconComp size={24} />
            <text
              style={{
                fontSize: "9px",
                color: $color.fg.neutralMuted,
                textAlign: "center",
                wordBreak: "break-all",
              }}
            >
              {name}
            </text>
          </view>
        ))}
      </view>
    </scroll-view>
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
