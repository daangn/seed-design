// @ungap/structured-clone ships no type declarations. The `/json` subpath
// exposes a JSON-string codec (structured-clone semantics) used to serialize and
// restore the story controls tree. `parse` returns `unknown`; callers narrow it.
declare module "@ungap/structured-clone/json" {
  export function stringify(value: unknown): string;
  export function parse(value: string): unknown;
}
