/** Inline style that hides an element visually while keeping it focusable and
 * form-interactive — used for the native `<input>` inside form controls. */
export const VISUALLY_HIDDEN: Partial<CSSStyleDeclaration> = {
  position: "absolute",
  width: "1px",
  height: "1px",
  padding: "0",
  margin: "0",
  overflow: "hidden",
  clip: "rect(0 0 0 0)",
  whiteSpace: "nowrap",
  border: "0",
};
