const fs = require('fs/promises');
const path = require('path');
const kebabcase = require('lodash.kebabcase');

const { colors } = require('./lib/index');

const render = vars => `:root {
  ${Object.entries(vars)
    .map(([name, value]) => `${name}: ${value};`)
    .join('\n  ')
  }
}`;

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

const generateStyleSheet = async themeKey => {
  const { scheme, semanticScheme } = colors[themeKey];
  const theme = render({
    ...makeColorVars(scheme),
    ...makeSemanticColorVars(scheme, semanticScheme),
  });
  const themePath = path.resolve(`./lib/colors/${themeKey}.css`);

  await fs.mkdir(path.dirname(themePath), { recursive: true });
  await fs.writeFile(themePath, theme, 'utf-8');

  return themePath;
};

Promise.all([
  generateStyleSheet('light'),
  generateStyleSheet('dark'),
]).then(files => {
  console.log('stylesheets have successfully generated!');
  console.log(` - ${files
    .map(file => path.relative(process.cwd(), file))
    .join('\n - ')
  }`);
});
