import "./src/styles/global.css";

import type { WrapPageElementBrowserArgs } from "gatsby";
import { useEffect } from "react";

import Layout from "./src/_Layout";
import Root from "./src/_Root";

export const wrapPageElement = ({
  element,
  props,
}: WrapPageElementBrowserArgs) => {
  const layoutType = props.location.pathname === "/" ? "main" : "document";

  useEffect(() => {
    if (window.location.hostname === "seed-design.pages.dev") {
      window.location.href = "https://seed-design.io" + props.location.pathname;
    }
  }, []);

  return (
    <Root>
      <Layout type={layoutType}>{element}</Layout>
    </Root>
  );
};
