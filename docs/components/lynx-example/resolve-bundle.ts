import {
  type LynxExampleName,
  parseLynxExampleManifest,
} from "../../lib/lynx-examples/manifest-schema";

export async function resolveLynxExampleBundle(
  name: LynxExampleName,
  bundlePath: string,
  origin: string,
  signal?: AbortSignal,
  request: typeof fetch = fetch,
): Promise<{ bundlePath: string; updated: boolean }> {
  const options = { cache: "no-store" as const, signal };
  const original = await request(new URL(bundlePath, origin), { ...options, method: "HEAD" });
  if (original.ok) return { bundlePath, updated: false };
  if (original.status !== 404) throw new Error("Lynx bundle에 접근할 수 없습니다.");

  // An open docs tab can outlive a deployment that removes its hashed bundle.
  const response = await request(new URL("/__lynx__/manifest.json", origin), options);
  if (!response.ok) throw new Error("현재 Lynx manifest를 불러올 수 없습니다.");
  const current = parseLynxExampleManifest(await response.json()).examples[name]?.lynx;
  if (!current || current === bundlePath) throw new Error("배포된 Lynx 예제를 찾을 수 없습니다.");
  const replacement = await request(new URL(current, origin), { ...options, method: "HEAD" });
  if (!replacement.ok) throw new Error("현재 Lynx bundle에 접근할 수 없습니다.");
  return { bundlePath: current, updated: true };
}
