import React from "react";

import * as style from "./Header.css";
import { Logo } from "./Logo";

export default function Header() {
  return (
    <header className={style.header}>
      <Logo to="/" />
    </header>
  );
}
