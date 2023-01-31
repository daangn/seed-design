import type { PropsWithChildren } from "react";

import * as style from "./do-dont.css";

export default function DoBox({ children }: PropsWithChildren) {
  return <article className={style.box}>{children}</article>;
}
