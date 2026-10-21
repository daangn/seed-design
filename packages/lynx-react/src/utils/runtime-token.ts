import type { EncodedToken, ScalarToken } from "@seed-design/lynx-css/vars/runtime";

const derivedSuffixes: Record<string, string> = Object.create(null);

export function expandToken(token: EncodedToken, prefix: string): string {
  return typeof token === "string" ? `${prefix}${token})` : token[0];
}

export function lookupToken(
  tokens: Readonly<Record<string, ScalarToken>>,
  key: string,
  prefix: string,
): string | undefined {
  if (!Object.prototype.hasOwnProperty.call(tokens, key)) return undefined;
  const token = tokens[key]!;
  const suffix =
    token === 0
      ? (derivedSuffixes[key] ??= key
          .replace(/\./g, "-")
          .replace(/([a-z])([A-Z]|\d)/g, "$1-$2")
          .toLowerCase())
      : token;
  return expandToken(suffix, prefix);
}
