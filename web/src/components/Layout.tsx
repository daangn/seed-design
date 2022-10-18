import { MDXProvider } from "@mdx-js/react";
import React from "react";

import { customComponents } from "./CustomComponents";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return <MDXProvider components={customComponents}>{children}</MDXProvider>;
}
