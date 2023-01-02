import { classNames } from "@seed-design/design-token";
import clsx from "clsx";

import * as style from "./Card.css";

interface PropsWithChildren {
  children: React.ReactNode;
}

/* Common */

export function CardCaption({ children }: PropsWithChildren) {
  return (
    <div
      className={clsx(
        classNames.$semantic.typography.bodyL1Regular,
        style.cardCaption,
      )}
    >
      {children}
    </div>
  );
}

/* Full Card */

export function FullCard({ children }: PropsWithChildren) {
  return <article className={clsx(style.fullCard)}>{children}</article>;
}

export function FullCardImageCell({ children }: PropsWithChildren) {
  return <div className={clsx(style.fullCardImageCell)}>{children}</div>;
}

export function FullCardDescription({ children }: PropsWithChildren) {
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

/* Half Card */

export function HalfCard({ children }: PropsWithChildren) {
  return <article className={clsx(style.halfCard)}>{children}</article>;
}

export function HalfCardImageCell({ children }: PropsWithChildren) {
  return <div className={clsx(style.halfCardImageCell)}>{children}</div>;
}

export function HalfCardDescriptionCell({ children }: PropsWithChildren) {
  return <div className={clsx(style.halfCardDescriptionCell)}>{children}</div>;
}

export function HalfCardDescriptionTitle({ children }: PropsWithChildren) {
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

export function HalfCardDescription({ children }: PropsWithChildren) {
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
