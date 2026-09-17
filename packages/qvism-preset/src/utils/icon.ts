import type { Property } from "csstype";

export interface IconProps {
  size?: string;
  color?: string;

  fontSize?: Property.FontSize;
  fontWeight?: string;
  verticalAlign?: Property.VerticalAlign;

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

  if (props.fontSize) {
    result["--seed-prefix-icon-font-size"] = props.fontSize;
  }

  if (props.fontWeight) {
    result["--seed-prefix-icon-font-weight"] = props.fontWeight;
  }

  if (props.verticalAlign) {
    result["--seed-prefix-icon-vertical-align"] = props.verticalAlign;
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

  if (props.fontSize) {
    result["--seed-suffix-icon-font-size"] = props.fontSize;
  }

  if (props.fontWeight) {
    result["--seed-suffix-icon-font-weight"] = props.fontWeight;
  }

  if (props.verticalAlign) {
    result["--seed-suffix-icon-vertical-align"] = props.verticalAlign;
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

export function onlyIcon(props: IconProps) {
  const result: Record<`--${string}`, string> = {};

  if (props.size) {
    result["--seed-icon-size"] = props.size;
  }

  if (props.color) {
    result["--seed-icon-color"] = props.color;
  }

  if (props.fontSize) {
    result["--seed-icon-font-size"] = props.fontSize;
  }

  if (props.fontWeight) {
    result["--seed-icon-font-weight"] = props.fontWeight;
  }

  if (props.verticalAlign) {
    result["--seed-icon-vertical-align"] = props.verticalAlign;
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
