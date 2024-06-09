import * as React from "react";

type Booleanish = boolean | "true" | "false"
export const dataAttr = (guard: boolean | undefined) => {
  return guard ? "" : undefined;
};
export const ariaAttr = (guard: boolean | undefined) => {
  return guard ? "true" : undefined as Booleanish;
};

export const elementProps = (
  props: React.HTMLAttributes<HTMLElement> &
    Record<`data-${string}`, string | undefined>,
) => props;

export const inputProps = (
  props: React.InputHTMLAttributes<HTMLInputElement> &
    Record<`data-${string}`, string | undefined>,
) => props;

export const labelProps = (
  props: React.HTMLAttributes<HTMLLabelElement> &
    Record<`data-${string}`, string | undefined>,
) => props;
