import { classNames } from "@seed-design/design-token";
import clsx from "clsx";
import React from "react";

import * as style from "./DocumentCard.css";

interface PropsWithChildren {
  children: React.ReactNode;
}

export function DocumentCard({ children }: PropsWithChildren) {
  return <article className={clsx(style.documentCard)}>{children}</article>;
}

export function DocumentCardImageCell({ children }: PropsWithChildren) {
  return <div className={clsx(style.documentCardImage)}>{children}</div>;
}

export function DocumentCardDescriptionCell({ children }: PropsWithChildren) {
  return (
    <div className={clsx(style.documentCardDescriptionCell)}>{children}</div>
  );
}

export function DocumentCardTitle({ children }: PropsWithChildren) {
  return (
    <h3
      className={clsx(
        style.documentCardTitle,
        classNames.$semantic.typography.title3Regular,
      )}
    >
      {children}
    </h3>
  );
}

export function DocumentCardDescription({ children }: PropsWithChildren) {
  return (
    <div
      className={clsx(
        style.documentCardDescription,
        classNames.$semantic.typography.bodyL1Regular,
      )}
    >
      {children}
    </div>
  );
}
