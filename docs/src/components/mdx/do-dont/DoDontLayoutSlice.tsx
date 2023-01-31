import type { PropsWithChildren } from "react";

import * as style from "./do-dont.css";

export default function DoDontLayout({ children }: PropsWithChildren) {
  return <div className={style.doDontLayout}>{children}</div>;
}
