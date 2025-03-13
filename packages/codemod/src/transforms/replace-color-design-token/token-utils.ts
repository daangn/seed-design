/**
 * vars.$scale.color.carrot500 -> $scale.color.carrot-500
 * vars.$scale.color.grayAlpha50 -> $scale.color.gray-alpha-50
 */
export function toKebabCaseWithNumbers(name: string): string {
  return name
    .replace(/^vars\./, "")
    .replace(/[A-Z]/g, (char) => `-${char.toLowerCase()}`)
    .replace(/(\d+)/g, "-$1");
}

/**
 * $scale.color.carrot-500 -> vars.$scale.color.carrot500
 * $scale.color.gray-alpha-50 -> vars.$scale.color.grayAlpha50
 */
export function fromKebabCaseWithNumbers(name: string): string {
  return `vars.${name
    .replace(/-(\d+)/g, "$1")
    .replace(/-([a-z])/g, (_, char) => char.toUpperCase())}`;
}
