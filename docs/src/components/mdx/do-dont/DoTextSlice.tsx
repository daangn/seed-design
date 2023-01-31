import type { PropsWithChildren } from "react";

import * as style from "./do-dont.css";

export default function DoText({ children }: PropsWithChildren) {
  return (
    <div>
      <p className={style.doTitleText}>Do</p>
      <p className={style.description}>{children}</p>
    </div>
  );
}
