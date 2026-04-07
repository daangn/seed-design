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
    result["--ride-prefix-icon-size"] = props.size;
  }

  if (props.color) {
    result["--ride-prefix-icon-color"] = props.color;
  }

  if (props.marginLeft) {
    result["--ride-prefix-icon-margin-left"] = props.marginLeft;
  }

  if (props.marginRight) {
    result["--ride-prefix-icon-margin-right"] = props.marginRight;
  }

  if (props.marginTop) {
    result["--ride-prefix-icon-margin-top"] = props.marginTop;
  }

  if (props.marginBottom) {
    result["--ride-prefix-icon-margin-bottom"] = props.marginBottom;
  }

  if (props.alignSelf) {
    result["--ride-prefix-icon-align-self"] = props.alignSelf;
  }

  if (props.justifySelf) {
    result["--ride-prefix-icon-justify-self"] = props.justifySelf;
  }

  return result;
}

export function suffixIcon(props: IconProps) {
  const result: Record<`--${string}`, string> = {};

  if (props.size) {
    result["--ride-suffix-icon-size"] = props.size;
  }

  if (props.color) {
    result["--ride-suffix-icon-color"] = props.color;
  }

  if (props.marginLeft) {
    result["--ride-suffix-icon-margin-left"] = props.marginLeft;
  }

  if (props.marginRight) {
    result["--ride-suffix-icon-margin-right"] = props.marginRight;
  }

  if (props.marginTop) {
    result["--ride-suffix-icon-margin-top"] = props.marginTop;
  }

  if (props.marginBottom) {
    result["--ride-suffix-icon-margin-bottom"] = props.marginBottom;
  }

  if (props.alignSelf) {
    result["--ride-suffix-icon-align-self"] = props.alignSelf;
  }

  if (props.justifySelf) {
    result["--ride-suffix-icon-justify-self"] = props.justifySelf;
  }

  return result;
}

export function onlyIcon(props: Pick<IconProps, "size" | "color">) {
  const result: Record<`--${string}`, string> = {};

  if (props.size) {
    result["--ride-icon-size"] = props.size;
  }

  if (props.color) {
    result["--ride-icon-color"] = props.color;
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
