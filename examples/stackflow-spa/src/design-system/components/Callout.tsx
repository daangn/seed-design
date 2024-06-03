import { Slot } from "@radix-ui/react-slot";
import { IconChevronRightRegular } from "@seed-design/icon";
import { callout, CalloutVariantProps } from "@seed-design/recipe/callout";
import clsx from "clsx";
import * as React from "react";

import "@seed-design/stylesheet/callout.css";
import { halfWidthIconProps } from "../util/halfWidth";

export interface CalloutProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "children" | "title">,
    CalloutVariantProps {
  icon?: React.ReactNode;

  title?: React.ReactNode;

  description: React.ReactNode;
}

export const Callout = React.forwardRef<HTMLDivElement, CalloutProps>(
  (
    { className, variant = "neutral", icon, title, description, ...otherProps },
    ref,
  ) => {
    const classNames = callout({ variant });
    return (
      <div
        ref={ref}
        className={clsx(classNames.root, className)}
        {...otherProps}
      >
        {icon && <Slot className={classNames.icon}>{icon}</Slot>}
        <p className={classNames.content}>
          {title && <span className={classNames.title}>{title} </span>}
          <span className={classNames.description}>{description}</span>
        </p>
      </div>
    );
  },
);
Callout.displayName = "Callout";

export interface ActionableCalloutProps
  extends Omit<React.HTMLAttributes<HTMLButtonElement>, "children" | "title">,
    CalloutVariantProps {
  icon?: React.ReactNode;

  title?: React.ReactNode;

  description: React.ReactNode;
}

export const ActionableCallout = React.forwardRef<
  HTMLButtonElement,
  ActionableCalloutProps
>(
  (
    { className, variant = "neutral", icon, title, description, ...otherProps },
    ref,
  ) => {
    const classNames = callout({ variant });
    return (
      <button
        ref={ref}
        className={clsx(classNames.root, className)}
        {...otherProps}
      >
        {icon && <Slot className={classNames.icon}>{icon}</Slot>}
        <p className={classNames.content}>
          {title && <span className={classNames.title}>{title} </span>}
          <span className={classNames.description}>{description}</span>
        </p>
        <IconChevronRightRegular
          {...halfWidthIconProps}
          className={classNames.actionIndicator}
        />
      </button>
    );
  },
);
ActionableCallout.displayName = "ActionableCallout";
