import clsx from "clsx";

import * as style from "./Keyboard.css";

interface KeyboardProps {
  children: React.ReactNode;
}

export default function Keyboard({ children }: KeyboardProps) {
  if (children === "↩") {
    return (
      <kbd
        className={clsx(style.rightArrowCurvingLeftKey)}
        aria-label="Right Arrow Curving Left"
      >
        {children}
      </kbd>
    );
  }

  return <kbd className={clsx(style.keyboard)}>{children}</kbd>;
}
