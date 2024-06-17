import * as fs from 'fs/promises';
import * as path from 'path';

import { colors } from './lib/index.mjs';

const kebabcase = str => str.replace(/[A-Z]/g, v => `-${v.toLowerCase()}`);
const indent = depth => ' '.repeat(depth * 2);

const render = (scope, vars, depth = 1) => `${scope} {
${indent(depth)}${Object.entries(vars)
    .map(([name, value]) => typeof value === 'object'
      ? render(name, value, depth + 1)
      : `${name}: ${value};`
    )
    .join('\n' + indent(depth))
  }
${indent(depth - 1)}}`;

const makeColorVars = scheme => {
  const vars = {};
  for (const [token, value] of Object.entries(scheme)) {
    const varName = token.replace('$', '--color-');
    vars[varName] = value;
  }
  return vars;
}

const makeSemanticColorVars = (scheme, semanticScheme) => {
  const vars = {};
  for (const [key, value] of Object.entries(semanticScheme)) {
    const varName = `--color-${kebabcase(key)}`;
    if (scheme[value]) {
      const refVarName = value.replace('$', '--color-');
      vars[varName] = `var(${refVarName})`;
    } else {
      vars[varName] = value;
    }
  }
  return vars;
};

const generateThemeStyleSheet = async themeKey => {
  const { scheme, semanticScheme } = colors[themeKey];
  const theme = render(`.${themeKey}-theme`, {
    ...makeColorVars(scheme),
    ...makeSemanticColorVars(scheme, semanticScheme),
  });
  const themePath = path.resolve(`./lib/colors/${themeKey}.css`);

  await fs.mkdir(path.dirname(themePath), { recursive: true });
  await fs.writeFile(themePath, theme, 'utf-8');

  return themePath;
};

const generateSystemStyleSheet = async () => {
  const { scheme: lightScheme, semanticScheme: lightSemanticScheme } = colors['light'];
  const lightTheme = render(`:root`, {
    ...makeColorVars(lightScheme),
    ...makeSemanticColorVars(lightScheme, lightSemanticScheme),
  });

  const { scheme: darkScheme, semanticScheme: darkSemanticScheme } = colors['dark'];
  const darkTheme = render('@media (prefers-color-scheme: dark)', {
    ':root': {
      ...makeColorVars(darkScheme),
      ...makeSemanticColorVars(darkScheme, darkSemanticScheme),
    },
  });

  const theme = [lightTheme, darkTheme].join('\n\n');

  const themePath = path.resolve(`./lib/colors/system.css`);

  await fs.mkdir(path.dirname(themePath), { recursive: true });
  await fs.writeFile(themePath, theme, 'utf-8');

  return themePath;
};

const files = await Promise.all([
  generateThemeStyleSheet('light'),
  generateThemeStyleSheet('dark'),
  generateSystemStyleSheet(),
]);

console.log(`
Stylesheets have successfully generated!
- ${files
  .map(file => path.relative(process.cwd(), file))
  .join('\n- ')
}`);
