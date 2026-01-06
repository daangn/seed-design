import type { Property } from "csstype";

export interface IconProps {
  size?: string;
  color?: string;

  marginLeft?: Property.MarginLeft;
  marginRight?: Property.MarginRight;
  marginTop?: Property.MarginTop;
  marginBottom?: Property.MarginBottom;

  alignSelf?: Property.AlignSelf;
  justifySelf?: Property.JustifySelf;
}

export function prefixIcon(props: IconProps) {
  const result: Record<`--${string}`, string> = {};

  if (props.size) {
    result["--seed-prefix-icon-size"] = props.size;
  }

  if (props.color) {
    result["--seed-prefix-icon-color"] = props.color;
  }

  if (props.marginLeft) {
    result["--seed-prefix-icon-margin-left"] = props.marginLeft;
  }

  if (props.marginRight) {
    result["--seed-prefix-icon-margin-right"] = props.marginRight;
  }

  if (props.marginTop) {
    result["--seed-prefix-icon-margin-top"] = props.marginTop;
  }

  if (props.marginBottom) {
    result["--seed-prefix-icon-margin-bottom"] = props.marginBottom;
  }

  if (props.alignSelf) {
    result["--seed-prefix-icon-align-self"] = props.alignSelf;
  }

  if (props.justifySelf) {
    result["--seed-prefix-icon-justify-self"] = props.justifySelf;
  }

  return result;
}

export function suffixIcon(props: IconProps) {
  const result: Record<`--${string}`, string> = {};

  if (props.size) {
    result["--seed-suffix-icon-size"] = props.size;
  }

  if (props.color) {
    result["--seed-suffix-icon-color"] = props.color;
  }

  if (props.marginLeft) {
    result["--seed-suffix-icon-margin-left"] = props.marginLeft;
  }

  if (props.marginRight) {
    result["--seed-suffix-icon-margin-right"] = props.marginRight;
  }

  if (props.marginTop) {
    result["--seed-suffix-icon-margin-top"] = props.marginTop;
  }

  if (props.marginBottom) {
    result["--seed-suffix-icon-margin-bottom"] = props.marginBottom;
  }

  if (props.alignSelf) {
    result["--seed-suffix-icon-align-self"] = props.alignSelf;
  }

  if (props.justifySelf) {
    result["--seed-suffix-icon-justify-self"] = props.justifySelf;
  }

  return result;
}

export function onlyIcon(props: Pick<IconProps, "size" | "color">) {
  const result: Record<`--${string}`, string> = {};

  if (props.size) {
    result["--seed-icon-size"] = props.size;
  }

  if (props.color) {
    result["--seed-icon-color"] = props.color;
  }

  return result;

  // return {
  //   ...result,

  //   "@supports (selector(:where(div)))": {
  //     "& :where(svg)": {
  //       display: "inline-flex",
  //       alignItems: "center",
  //       justifyContent: "center",
  //       flexShrink: 0,
  //       width: props.size,
  //       height: props.size,
  //       color: props.color,
  //     },
  //   },
  //   "@supports not (selector(:where(div)))": {
  //     "& svg": {
  //       display: "inline-flex",
  //       alignItems: "center",
  //       justifyContent: "center",
  //       flexShrink: 0,
  //       width: props.size,
  //       height: props.size,
  //       color: props.color,
  //     },
  //   },
  // };
}
