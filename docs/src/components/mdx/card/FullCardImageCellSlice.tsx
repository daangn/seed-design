import clsx from "clsx";

import * as style from "./card.css";

interface PropsWithChildren {
  children: React.ReactNode;
}

export default function FullCardImageCell({ children }: PropsWithChildren) {
  return <div className={clsx(style.fullCardImageCell)}>{children}</div>;
}
