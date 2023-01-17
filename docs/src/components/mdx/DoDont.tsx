import V from "@karrotmarket/karrot-ui-icon/lib/react/IconCheckFill";
import X from "@karrotmarket/karrot-ui-icon/lib/react/IconCloseFill";
import type { PropsWithChildren } from "react";

import * as style from "./DoDont.css";

export function DoImage({ children }: PropsWithChildren) {
  return (
    <div className={style.doCard}>
      <span className={style.doIcon}>
        <V width={22} />
      </span>
      {children}
    </div>
  );
}

export function DoText({ children }: PropsWithChildren) {
  return (
    <div>
      <p className={style.doTitleText}>Do</p>
      <p className={style.description}>{children}</p>
    </div>
  );
}

export function DoBox({ children }: PropsWithChildren) {
  return <article className={style.box}>{children}</article>;
}

export function DontImage({ children }: PropsWithChildren) {
  return (
    <div className={style.dontCard}>
      <span className={style.dontIcon}>
        <X width={22} />
      </span>
      {children}
    </div>
  );
}

export function DontText({ children }: PropsWithChildren) {
  return (
    <div>
      <p className={style.dontTitleText}>Don't</p>
      <p className={style.description}>{children}</p>
    </div>
  );
}

export function DontBox({ children }: PropsWithChildren) {
  return <article className={style.box}>{children}</article>;
}

export function DoDontLayout({ children }: PropsWithChildren) {
  return <div className={style.doDontLayout}>{children}</div>;
}
