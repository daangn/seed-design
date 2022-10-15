import { MDXProvider } from "@mdx-js/react";
import React from "react";

import Title from "./Title";

interface LayoutProps {
  children: React.ReactNode;
}

const shortcodes = { Title };

export default function Layout({ children }: LayoutProps) {
  return <MDXProvider components={shortcodes}>{children}</MDXProvider>;
}
