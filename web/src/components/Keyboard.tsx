import clsx from "clsx";
import React from "react";

import * as style from "./Keyboard.css";

interface KeyboardProps {
  children: React.ReactNode;
}

export default function Keyboard({ children }: KeyboardProps) {
  return <span className={clsx(style.keyboard)}>{children}</span>;
}
