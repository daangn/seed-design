import X from "@karrotmarket/karrot-ui-icon/lib/react/IconCloseFill";
import type { PropsWithChildren } from "react";

import * as style from "./do-dont.css";

export default function DontImage({ children }: PropsWithChildren) {
  return (
    <div className={style.dontCard}>
      <span className={style.dontIcon}>
        <X width={22} />
      </span>
      {children}
    </div>
  );
}
