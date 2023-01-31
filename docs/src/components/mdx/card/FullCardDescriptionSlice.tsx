import { classNames } from "@seed-design/design-token";
import clsx from "clsx";

import * as style from "./card.css";

interface PropsWithChildren {
  children: React.ReactNode;
}

export default function FullCardDescription({ children }: PropsWithChildren) {
  return (
    <div
      className={clsx(
        classNames.$semantic.typography.bodyL1Regular,
        style.fullCardDescription,
      )}
    >
      {children}
    </div>
  );
}
