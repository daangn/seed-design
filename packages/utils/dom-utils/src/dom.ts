import type * as React from "react";

type Booleanish = boolean | "true" | "false";
export const dataAttr = (guard: boolean | undefined) => {
  return guard ? "" : undefined;
};
export const ariaAttr = (guard: boolean | undefined): Booleanish | undefined => {
  return guard ? "true" : undefined;
};

type DataAttr = { [key in `data-${string}`]?: string | undefined };
type WithoutRef<T> = Omit<T, "ref">;

export const elementProps = (
  props: React.HTMLAttributes<HTMLElement> & DataAttr,
): WithoutRef<React.HTMLAttributes<HTMLElement>> => props;

export const inputProps = (
  props: React.InputHTMLAttributes<HTMLInputElement> & DataAttr,
): WithoutRef<React.InputHTMLAttributes<HTMLInputElement>> => props;

export const selectProps = (
  props: React.SelectHTMLAttributes<HTMLSelectElement> & DataAttr,
): WithoutRef<React.SelectHTMLAttributes<HTMLSelectElement>> => props;

export const labelProps = (
  props: React.LabelHTMLAttributes<HTMLLabelElement> & DataAttr,
): WithoutRef<React.LabelHTMLAttributes<HTMLLabelElement>> => props;

export const buttonProps = (
  props: React.ButtonHTMLAttributes<HTMLButtonElement> & DataAttr,
): WithoutRef<React.ButtonHTMLAttributes<HTMLButtonElement>> => props;

export const imgProps = (
  props: React.ImgHTMLAttributes<HTMLImageElement> & DataAttr,
): WithoutRef<React.ImgHTMLAttributes<HTMLImageElement>> => props;
