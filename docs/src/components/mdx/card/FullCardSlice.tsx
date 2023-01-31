import clsx from "clsx";

import * as style from "./card.css";

interface PropsWithChildren {
  children: React.ReactNode;
}

export default function FullCard({ children }: PropsWithChildren) {
  return <article className={clsx(style.fullCard)}>{children}</article>;
}
