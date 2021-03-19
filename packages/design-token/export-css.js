const fs = require('fs/promises');
const path = require('path');

const { colors } = require('./lib/index.js');

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

fs.mkdir(path.dirname(lightThemePath), { recursive: true }).then(
  fs.writeFile(lightThemePath, lightTheme, 'utf-8')
)
