import fs from 'fs/promises';
import path from 'path';

import { colors } from './lib/index.mjs';

const render = vars => `:root {
  ${Object.entries(vars)
    .map(([name, value]) => `${name}: ${value};`)
    .join('\n  ')
  }
}`;

const makeVars = scheme => {
  const vars = {};
  for (const [token, value] of Object.entries(scheme)) {
    const varName = token.replace('$', '--');
    vars[varName] = value;
  }
  return vars;
}

const lightTheme = render(makeVars(colors.light));
const lightThemePath = path.resolve('./lib/colors/light.css');

await fs.mkdir(path.dirname(lightThemePath), { recursive: true });
await fs.writeFile(lightThemePath, lightTheme, 'utf-8');
