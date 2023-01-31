import { classNames } from "@seed-design/design-token";
import clsx from "clsx";

import * as style from "./card.css";

interface PropsWithChildren {
  children: React.ReactNode;
}

export default function HalfCardDescription({ children }: PropsWithChildren) {
  return (
    <div
      className={clsx(
        style.halfCardDescription,
        classNames.$semantic.typography.bodyL1Regular,
      )}
    >
      {children}
    </div>
  );
}
