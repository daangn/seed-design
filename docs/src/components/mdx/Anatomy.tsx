import type { PropsWithChildren } from "react";

import * as style from "./Anatomy.css";

export function Anatomy({ children }: PropsWithChildren) {
  return <div className={style.anatomy}>{children}</div>;
}
