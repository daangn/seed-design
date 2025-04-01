import type { NormalizedTextNode } from "../normalizer";
import { getTypographyVariableName } from "./variable";

// TODO: handle raw values
export function createTextProps(boundVariables: NormalizedTextNode["boundVariables"]) {
  const fontSizeBoundVariables = boundVariables?.fontSize?.[0];
  const fontStyleBoundVariables = boundVariables?.fontStyle?.[0];
  const lineHeightBoundVariables = boundVariables?.lineHeight?.[0];

  return {
    fontSize: fontSizeBoundVariables
      ? getTypographyVariableName(fontSizeBoundVariables.id)
      : undefined,
    fontWeight: fontStyleBoundVariables
      ? getTypographyVariableName(fontStyleBoundVariables.id)
      : undefined,
    lineHeight: lineHeightBoundVariables
      ? getTypographyVariableName(lineHeightBoundVariables.id)
      : undefined,
  };
}
