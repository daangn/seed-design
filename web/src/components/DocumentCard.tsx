import { classNames } from "@seed-design/design-token";
import clsx from "clsx";
import React from "react";

import * as style from "./DocumentCard.css";

interface PropsWithChildren {
  children: React.ReactNode;
}

/* Common */

export function DocumentCardCaption({ children }: PropsWithChildren) {
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

export function DocumentFullCard({ children }: PropsWithChildren) {
  return <article className={clsx(style.fullCard)}>{children}</article>;
}

export function DocumentFullCardImageCell({ children }: PropsWithChildren) {
  return <div className={clsx(style.fullCardImageCell)}>{children}</div>;
}

export function DocumentFullCardDescription({ children }: PropsWithChildren) {
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

export function DocumentHalfCard({ children }: PropsWithChildren) {
  return <article className={clsx(style.halfCard)}>{children}</article>;
}

export function DocumentHalfCardImageCell({ children }: PropsWithChildren) {
  return <div className={clsx(style.halfCardImageCell)}>{children}</div>;
}

export function DocumentHalfCardDescriptionCell({
  children,
}: PropsWithChildren) {
  return <div className={clsx(style.halfCardDescriptionCell)}>{children}</div>;
}

export function DocumentHalfCardDescriptionTitle({
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

export function DocumentHalfCardDescription({ children }: PropsWithChildren) {
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
