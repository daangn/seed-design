import "./global.css";
import "@seed-design/stylesheet/global.css";
import "../src/styles/global.css";

export const parameters = {
  actions: {
    argTypesRegex: "^on[A-Z].*",
  },
  a11y: {
    config: {
      // rule description: https://github.com/dequelabs/axe-core/blob/develop/doc/rule-descriptions.md
      rules: [
        {
          id: "color-contrast",
          enabled: false,
        },
      ],
    },
    // options:  https://github.com/dequelabs/axe-core/blob/develop/doc/API.md#options-parameter
    options: {},
  },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
  rootAttributesTooltip: true,
  rootAttributes: [
    {
      root: "html",
      attribute: "data-seed-scale-color",
      defaultState: {
        name: "Light",
        value: "light",
      },
      states: [
        {
          name: "Dark",
          value: "dark",
        },
      ],
    },
    {
      root: "html",
      attribute: "data-seed-letter-spacing",
      defaultState: {
        name: "iOS",
        value: "ios",
      },
      states: [
        {
          name: "Android",
          value: "android",
        },
      ],
    },
  ],
};

document.querySelector("html").dataset.seed = "";
document.querySelector("html").dataset.seedScaleColor = "light";
document.querySelector("html").dataset.seedLetterSpacing = "ios";
document.querySelector("html").style.backgroundColor =
  "var(--seed-semantic-color-paper-default)";
