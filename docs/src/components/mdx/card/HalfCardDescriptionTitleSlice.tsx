import { classNames } from "@seed-design/design-token";
import clsx from "clsx";

import * as style from "./card.css";

interface PropsWithChildren {
  children: React.ReactNode;
}

export default function HalfCardDescriptionTitle({
  children,
}: PropsWithChildren) {
  return (
    <h4
      className={clsx(
        style.halfCardDescriptionTitle,
        classNames.$semantic.typography.h4,
      )}
    >
      {children}
    </h4>
  );
}
