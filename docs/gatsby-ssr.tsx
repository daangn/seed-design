import "./src/styles/global.css";

import type { GatsbySSR, WrapPageElementNodeArgs } from "gatsby";
import * as React from "react";

import Root from "./src/Root";

const htmlAttributes: Record<string, string> = {
  lang: "ko",
};

export const onRenderBody: GatsbySSR["onRenderBody"] = ({
  setHtmlAttributes,
}) => {
  setHtmlAttributes(htmlAttributes);
};

export const wrapPageElement = ({ element }: WrapPageElementNodeArgs) => {
  return <Root>{element}</Root>;
};
