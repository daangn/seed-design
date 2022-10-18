import { classNames } from "@seed-design/design-token";
import clsx from "clsx";
import React from "react";

import * as style from "./CustomComponents.css";
import TitleDescription from "./TitleDescription";

export const customComponents = {
  /* 커스텀 HTML Elements */
  h1: (props: Object) => (
    <h1
      className={clsx(classNames.$semantic.typography.h1, style.h1)}
      {...props}
    />
  ),

  h2: (props: Object) => (
    <h2
      className={clsx(classNames.$semantic.typography.h2, style.h2)}
      {...props}
    />
  ),

  h3: (props: Object) => (
    <h3
      className={clsx(classNames.$semantic.typography.h3, style.h3)}
      {...props}
    />
  ),

  h4: (props: Object) => (
    <h4
      className={clsx(classNames.$semantic.typography.h4, style.h4)}
      {...props}
    />
  ),

  ol: (props: Object) => <ol className={clsx(style.ol)} {...props} />,

  li: (props: Object) => (
    <li
      className={clsx(classNames.$semantic.typography.bodyL1Regular, style.oli)}
      {...props}
    />
  ),

  /* MDX 전용 컴포넌트s */
  TitleDescription,
};
