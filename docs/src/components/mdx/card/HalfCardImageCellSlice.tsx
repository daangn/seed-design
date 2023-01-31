import clsx from "clsx";

import * as style from "./card.css";

interface PropsWithChildren {
  children: React.ReactNode;
}

export default function HalfCardImageCell({ children }: PropsWithChildren) {
  return <div className={clsx(style.halfCardImageCell)}>{children}</div>;
}
