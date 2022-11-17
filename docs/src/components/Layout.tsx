import React from "react";

import * as t from "../styles/token.css";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return <main className={t.main}>{children}</main>;
}
