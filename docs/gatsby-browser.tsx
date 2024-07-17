import "./src/styles/global.css";

import type { WrapPageElementBrowserArgs } from "gatsby";
import { useEffect } from "react";

import Layout from "./src/_Layout";
import Root from "./src/_Root";

export const wrapPageElement = ({
  element,
  props,
}: WrapPageElementBrowserArgs) => {
  const pathname = props.location.pathname;
  const layoutType = pathname === "/" ? "main" : "document";

  useEffect(() => {
    if (window.location.hostname === "seed-design.pages.dev") {
      window.location.replace(`https://seed-design.io${pathname}`);
    }
  }, []);

  useEffect(() => {
    if (
      pathname.startsWith("/component") &&
      pathname.endsWith("/") &&
      !pathname.includes("usage") &&
      !pathname.includes("style")
    ) {
      window.location.replace(`${pathname}usage/`);
    }
  }, []);

  return (
    <Root>
      <Layout type={layoutType}>{element}</Layout>
    </Root>
  );
};
