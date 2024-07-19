import type * as React from "react";

type Booleanish = boolean | "true" | "false";
export const dataAttr = (guard: boolean | undefined) => {
  return guard ? "" : undefined;
};
export const ariaAttr = (guard: boolean | undefined) => {
  return guard ? "true" : (undefined as Booleanish);
};

type DataAttr = Record<`data-${string}`, string | undefined>;

export const elementProps = (props: React.HTMLAttributes<HTMLElement> & DataAttr) => props;

export const inputProps = (props: React.InputHTMLAttributes<HTMLInputElement> & DataAttr) => props;

export const labelProps = (props: React.LabelHTMLAttributes<HTMLLabelElement> & DataAttr) => props;

export const buttonProps = (props: React.ButtonHTMLAttributes<HTMLButtonElement> & DataAttr) =>
  props;

export const imgProps = (props: React.ImgHTMLAttributes<HTMLImageElement> & DataAttr) => props;
