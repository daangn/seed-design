import V from "@karrotmarket/karrot-ui-icon/lib/react/IconCheckFill";
import type { PropsWithChildren } from "react";

import * as style from "./do-dont.css";

export default function DoImage({ children }: PropsWithChildren) {
  return (
    <div className={style.doCard}>
      <span className={style.doIcon}>
        <V width={22} />
      </span>
      {children}
    </div>
  );
}
