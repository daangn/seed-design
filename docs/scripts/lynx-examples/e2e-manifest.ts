import { LYNX_E2E_MANIFEST_SCHEMA_VERSION } from "./constants.js";
import type { LynxExampleManifest } from "./manifest.js";

/** Probelynx ID 규칙 `/^[a-z0-9][a-z0-9.-]*$/`를 만족하는 docs 예제 ID만 받는다. */
const CONVERTIBLE_EXAMPLE_ID = /^lynx\/([a-z0-9][a-z0-9-]*)\/([a-z0-9][a-z0-9-]*)$/;

/** Probelynx가 내려받을 lynx bundle과, 열 때 bundle URL에 붙일 query를 예제마다 담는다. */
export interface LynxE2EManifest {
  schemaVersion: typeof LYNX_E2E_MANIFEST_SCHEMA_VERSION;
  examples: Record<string, { lynx: string; query: string }>;
}

/** docs 예제 ID `lynx/<component>/<scenario>`를 Probelynx ID `<component>.<scenario>`로 바꾼다. */
export function getProbelynxExampleId(id: string): string {
  const match = CONVERTIBLE_EXAMPLE_ID.exec(id);
  if (!match) throw new Error(`Probelynx ID로 바꿀 수 없는 Lynx 예제 ID입니다: ${id}`);
  return `${match[1]}.${match[2]}`;
}

export function createE2EManifest(manifest: LynxExampleManifest): LynxE2EManifest {
  return {
    schemaVersion: LYNX_E2E_MANIFEST_SCHEMA_VERSION,
    examples: Object.fromEntries(
      Object.entries(manifest.examples).map(([id, { lynx }]) => [
        getProbelynxExampleId(id),
        { lynx, query: new URLSearchParams({ example: id, e2e: "1" }).toString() },
      ]),
    ),
  };
}
