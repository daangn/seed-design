import { classNames } from "@seed-design/design-token";
import clsx from "clsx";
import React from "react";

import * as style from "./TitleDescription.css";

interface TitleDescriptionProps {
  children: React.ReactNode;
}

export default function TitleDescription({ children }: TitleDescriptionProps) {
  return (
    <p
      className={clsx(
        classNames.$semantic.typography.title2Bold,
        style.titleDescription,
      )}
    >
      {children}
    </p>
  );
}
