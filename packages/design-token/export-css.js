const fs = require('fs/promises');
const path = require('path');

const { colors } = require('./lib/index');

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

const generateStyleSheet = async themeKey => {
  const theme = render(makeVars(colors[themeKey]));
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
