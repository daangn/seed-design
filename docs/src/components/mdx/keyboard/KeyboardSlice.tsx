import clsx from "clsx";

import * as style from "./keyboard.css";

/**
 * @description 키보드 입력을 표시하는 컴포넌트입니다.
 * @usage
 * ```tsx
 * <Keyboard>↩</Keyboard>
 *
 * <Keyboard>⌘</Keyboard>
 *
 * <Keyboard>⌥</Keyboard>
 * ```
 */
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
