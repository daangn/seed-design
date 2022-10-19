import clsx from "clsx";
import { Link } from "gatsby";
import React from "react";

import * as style from "./Logo.css";

export default function Logo() {
  return (
    <Link to="/">
      <div className={clsx(style.logo)}>SEED DESIGN</div>
    </Link>
  );
}
