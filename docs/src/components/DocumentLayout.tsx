import { MDXProvider } from "@mdx-js/react";
import React from "react";

import Header from "./Header";
import * as style from "./Layout.css";
import MdxComponents from "./mdx/MdxComponents";
import Sidebar from "./Sidebar";

interface LayoutProps {
  children: React.ReactNode;
}

export default function DocumentLayout({ children }: LayoutProps) {
  return (
    <MDXProvider components={MdxComponents}>
      <main className={style.main}>
        <Header />
        <Sidebar />
        {children}
      </main>
    </MDXProvider>
  );
}
