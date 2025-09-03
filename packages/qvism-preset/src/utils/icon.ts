import type { Property } from "csstype";

export interface IconProps {
  size?: string;
  color?: string;

  marginLeft?: Property.MarginLeft;
  marginRight?: Property.MarginRight;
  marginTop?: Property.MarginTop;

  // 네 변에 대해 모두 margin 프로퍼티가 지정되어 있는 경우
  // cssnano 등 최적화 도구가
  // margin: var(--seed-prefix-icon-margin-top) var(--seed-prefix-icon-margin-right) var(--seed-prefix-icon-margin-bottom) var(--seed-prefix-icon-margin-left);
  // 로 선언을 합칩니다.
  // 이때 네 개의 CSS variable 중 하나라도 정의되어 있지 않은 경우 어떤 margin도 적용되지 않으므로
  // 여기에서 marginBottom을 의도적으로 정의하지 않습니다.
  // also see: https://github.com/cssnano/cssnano/issues/1472

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
