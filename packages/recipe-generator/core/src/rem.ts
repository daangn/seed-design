export function rem(px: string | number, base: string | number = 16): string {
  if (typeof px === "string" && !px.endsWith("px")) {
    return px;
  }

  return `${parseFloat(px.toString()) / parseFloat(base.toString())}rem`;
}
