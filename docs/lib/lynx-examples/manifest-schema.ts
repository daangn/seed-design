const EXAMPLE_NAME = /^lynx\/[a-z0-9]+(?:-[a-z0-9]+)*\/[a-z0-9]+(?:-[a-z0-9]+)*$/;
const BUNDLE_URL = /^\/__lynx__\/.+\.(?:web|lynx)\.bundle$/;

export type LynxExampleName = `lynx/${string}/${string}`;

export interface LynxExampleManifest {
  schemaVersion: 1;
  examples: Record<LynxExampleName, { web: string; lynx: string }>;
}

export function parseLynxExampleManifest(value: unknown): LynxExampleManifest {
  if (!value || typeof value !== "object") throw new Error("Lynx manifest가 객체가 아닙니다.");
  const candidate = value as { schemaVersion?: unknown; examples?: unknown };
  if (candidate.schemaVersion !== 1) {
    throw new Error(`지원하지 않는 Lynx manifest schema입니다: ${String(candidate.schemaVersion)}`);
  }
  if (!candidate.examples || typeof candidate.examples !== "object") {
    throw new Error("Lynx manifest에 examples 객체가 없습니다.");
  }

  for (const [name, entry] of Object.entries(candidate.examples)) {
    if (!EXAMPLE_NAME.test(name)) throw new Error(`잘못된 Lynx 예제 이름입니다: ${name}`);
    if (!entry || typeof entry !== "object")
      throw new Error(`${name} manifest entry가 객체가 아닙니다.`);
    const platforms = entry as { web?: unknown; lynx?: unknown };
    for (const platform of ["web", "lynx"] as const) {
      if (typeof platforms[platform] !== "string" || !BUNDLE_URL.test(platforms[platform])) {
        throw new Error(`${name}의 ${platform} bundle URL이 올바르지 않습니다.`);
      }
      if (!platforms[platform].endsWith(`.${platform}.bundle`)) {
        throw new Error(`${name}의 ${platform} bundle platform이 일치하지 않습니다.`);
      }
    }
  }

  return candidate as LynxExampleManifest;
}
