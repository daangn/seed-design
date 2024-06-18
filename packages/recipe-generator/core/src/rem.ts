export function rem(px: string | number, base: string | number = 16): string {
  if (typeof px === "string" && !px.endsWith("px")) {
    return px;
  }

  return `${Number.parseFloat(px.toString()) / Number.parseFloat(base.toString())}rem`;
}
