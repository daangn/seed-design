import "@seed-design/stylesheet/global.css";
import "./src/styles/global.css";

import type { GatsbySSR, WrapPageElementNodeArgs } from "gatsby";
import * as React from "react";

import Root from "./src/Root";

const htmlAttributes: Record<string, string> = {
  "data-seed": "auto",
  lang: "ko",
};

const bodyAttributes: Record<string, string> = {
  "data-seed-scale-color": "light",
  "data-seed-scale-letter-spacing": "ios",
};

export const onRenderBody: GatsbySSR["onRenderBody"] = ({
  setBodyAttributes,
  setHtmlAttributes,
}) => {
  setHtmlAttributes(htmlAttributes);
  setBodyAttributes(bodyAttributes);
};

export const wrapPageElement = ({ element }: WrapPageElementNodeArgs) => {
  return <Root>{element}</Root>;
};
