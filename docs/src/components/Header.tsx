import React from "react";

import * as style from "./Header.css";
import Sidebar from "./Sidebar";
import ThemeToggler from "./ThemeToggler";

export default function Header() {
  return (
    <header className={style.header}>
      <Sidebar />
      <ThemeToggler />
    </header>
  );
}
