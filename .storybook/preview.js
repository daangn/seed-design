import "@seed-design/stylesheet/global.css";
import { addDecorator, addParameters } from "@storybook/react";
import { withRootAttribute } from "storybook-addon-root-attribute";
import "./reset.css";

addDecorator(withRootAttribute);
addParameters({
  rootAttribute: {
    root: "html",
    attribute: "data-seed-scale-color",
    defaultState: {
      name: "Light",
      value: "light"
    },
    states: [
      {
        name: "Dark",
        value: "dark"
      }
    ]
  }
});

document.querySelector("html").dataset.seed = "";
document.querySelector("html").style.backgroundColor =
  "var(--seed-semantic-color-paper-default)";
