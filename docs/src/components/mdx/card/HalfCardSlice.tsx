import clsx from "clsx";

import * as style from "./card.css";

interface PropsWithChildren {
  children: React.ReactNode;
}

export default function HalfCard({ children }: PropsWithChildren) {
  return <article className={clsx(style.halfCard)}>{children}</article>;
}
