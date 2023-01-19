import "./src/styles/global.css";

import type { GatsbySSR, WrapPageElementNodeArgs } from "gatsby";

import Layout from "./src/_Layout";
import Root from "./src/_Root";

const htmlAttributes: Record<string, string> = {
  lang: "ko",
};

export const onRenderBody: GatsbySSR["onRenderBody"] = ({
  setHtmlAttributes,
}) => {
  setHtmlAttributes(htmlAttributes);
};

export const wrapPageElement = ({
  element,
  props,
}: WrapPageElementNodeArgs) => {
  const layoutType = props.location.pathname === "/" ? "main" : "document";

  return (
    <Root>
      <Layout type={layoutType}>{element}</Layout>
    </Root>
  );
};
