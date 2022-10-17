import "@seed-design/stylesheet/global.css";

import React from "react";

import Root from "./src/Root";

export const wrapPageElement = ({ element }) => {
  return <Root>{element}</Root>;
};
