import type * as React from "react";

type Booleanish = boolean | "true" | "false";
export const dataAttr = (guard: boolean | undefined) => {
  return guard ? "" : undefined;
};
export const ariaAttr = (guard: boolean | undefined) => {
  return guard ? "true" : (undefined as Booleanish);
};

export const elementProps = (
  props: React.HTMLAttributes<HTMLElement> & Record<`data-${string}`, string | undefined>,
) => props;

export const inputProps = (
  props: React.InputHTMLAttributes<HTMLInputElement> & Record<`data-${string}`, string | undefined>,
) => props;

export const labelProps = (
  props: React.LabelHTMLAttributes<HTMLLabelElement> & Record<`data-${string}`, string | undefined>,
) => props;

export const buttonProps = (
  props: React.ButtonHTMLAttributes<HTMLButtonElement> &
    Record<`data-${string}`, string | undefined>,
) => props;

export const imgProps = (
  props: React.ImgHTMLAttributes<HTMLImageElement> & Record<`data-${string}`, string | undefined>,
) => props;
