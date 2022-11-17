import { MDXProvider } from "@mdx-js/react";
import React from "react";

import MdxComponents from "./mdx/MdxComponents";

interface Props {
  children: React.ReactNode;
}

const Layout = ({ children }: Props) => {
  return <MDXProvider components={MdxComponents}>{children}</MDXProvider>;
};

export default Layout;
