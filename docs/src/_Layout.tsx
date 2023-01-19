import { MDXProvider } from "@mdx-js/react";
import type { PropsWithChildren } from "react";

import Header from "./components/Header";
import MdxComponents from "./components/mdx/MdxComponents";
import Sidebar from "./components/Sidebar";
import * as t from "./styles/token.css";

interface LayoutProps {
  type: "document" | "main";
}

const Layout = ({ children, type }: PropsWithChildren<LayoutProps>) => {
  switch (type) {
    case "document":
      return (
        <MDXProvider components={MdxComponents}>
          <main className={t.main}>
            <Header />
            <Sidebar />
            {children}
          </main>
        </MDXProvider>
      );

    case "main":
      return (
        <main className={t.main}>
          <Header />
          {children}
        </main>
      );
  }
};

export default Layout;
