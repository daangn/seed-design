import React from "react";

import Header from "./Header";
import * as style from "./Layout.css";
import Sidebar from "./Sidebar";

interface LayoutProps {
  children: React.ReactNode;
}

export default function PageLayout({ children }: LayoutProps) {
  return (
    <main className={style.main}>
      <Header />
      <Sidebar />
      {children}
    </main>
  );
}
