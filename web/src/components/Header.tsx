import React from "react";

import Drawer from "./Drawer";
import * as style from "./Header.css";
import ThemeToggler from "./ThemeToggler";

export default function Header() {
  return (
    <header className={style.header}>
      <Drawer />
      <ThemeToggler />
    </header>
  );
}
