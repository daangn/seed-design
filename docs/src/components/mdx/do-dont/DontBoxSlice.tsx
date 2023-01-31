import type { PropsWithChildren } from "react";

import * as style from "./do-dont.css";

export default function DontBox({ children }: PropsWithChildren) {
  return <article className={style.box}>{children}</article>;
}
