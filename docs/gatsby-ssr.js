import "@seed-design/stylesheet/global.css";
import "./src/styles/global.css";

import * as React from "react";

import Root from "./src/Root";

export const onRenderBody = ({ setBodyAttributes, setHtmlAttributes }) => {
  setHtmlAttributes({
    "data-seed": "auto",
    lang: "ko",
  });

  setBodyAttributes({
    "data-seed-scale-color": "light",
    "data-seed-scale-letter-spacing": "ios",
  });
};

export const wrapPageElement = ({ element }) => {
  return <Root>{element}</Root>;
};
