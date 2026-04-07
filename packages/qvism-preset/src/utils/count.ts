export interface CountProps {
  fontSize?: string;
  lineHeight?: string | number;
  fontWeight?: string;
  color?: string;
}

export function count(props: CountProps) {
  const result: Record<`--${string}`, string | number> = {};

  if (props.fontSize) {
    result["--ride-count-font-size"] = props.fontSize;
  }

  if (props.lineHeight) {
    result["--ride-count-line-height"] = props.lineHeight;
  }

  if (props.fontWeight) {
    result["--ride-count-font-weight"] = props.fontWeight;
  }

  if (props.color) {
    result["--ride-count-color"] = props.color;
  }

  return result;
}
