import { RESOURCE_PATTERN, VERSION_PATTERN } from "./contract";

export type RootageRoute =
  | { kind: "version"; version: string; path: string }
  | { kind: "stable"; alias: "latest" | "legacy"; path: string };

export function parseRootagePath(pathname: string): RootageRoute | null {
  if (!pathname.startsWith("/rootage/") || pathname.includes("%") || pathname.includes("\\"))
    return null;
  if (pathname.includes("//") || pathname.includes("/./") || pathname.includes("/../")) return null;
  const suffix = pathname.slice("/rootage/".length);
  const segments = suffix.split("/");
  if (segments.some((segment) => !segment)) return null;
  if (segments[0]?.startsWith("v")) {
    const version = segments[0].slice(1);
    const path = `/${segments.slice(1).join("/")}`;
    if (!VERSION_PATTERN.test(version) || !RESOURCE_PATTERN.test(path)) return null;
    return { kind: "version", version, path };
  }
  if (segments[0] === "latest") {
    const path = `/${segments.slice(1).join("/")}`;
    return RESOURCE_PATTERN.test(path) ? { kind: "stable", alias: "latest", path } : null;
  }
  const path = `/${segments.join("/")}`;
  return RESOURCE_PATTERN.test(path) ? { kind: "stable", alias: "legacy", path } : null;
}
