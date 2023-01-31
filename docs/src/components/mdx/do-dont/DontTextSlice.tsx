import type { PropsWithChildren } from "react";

import * as style from "./do-dont.css";

export default function DontText({ children }: PropsWithChildren) {
  return (
    <div>
      <p className={style.dontTitleText}>Don't</p>
      <p className={style.description}>{children}</p>
    </div>
  );
}
