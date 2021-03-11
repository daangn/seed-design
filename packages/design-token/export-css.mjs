import fs from 'fs/promises';
import path from 'path';
import { stripIndent } from 'common-tags';
import { colors } from './lib/index.mjs';

const render = vars => stripIndent`
  :root {
    ${Object.entries(vars)
      .map(([name, value]) => `${name}: ${value};`)
      .join('\n    ')
    }
  }
`;

const makeVars = scheme => {
  const vars = {};
  for (const [token, value] of Object.entries(colors.light)) {
    const varName = token.replace('$', '--');
    vars[varName] = value;
  }
  return vars;
}

const outputPath = path.resolve('./lib/index.css');
const styleSheet = render(makeVars(colors.light));

await fs.mkdir(path.dirname(outputPath), { recursive: true });
await fs.writeFile(outputPath, styleSheet, 'utf-8');
