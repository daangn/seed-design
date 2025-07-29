export interface IconProps {
  size?: string;
  color?: string;
  marginLeft?: string;
  marginRight?: string;
  marginTop?: string;
  marginBottom?: string;
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
