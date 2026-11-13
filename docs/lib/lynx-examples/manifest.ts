import "server-only";

import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { type LynxExampleName, parseLynxExampleManifest } from "./manifest-schema";

export type { LynxExampleManifest, LynxExampleName } from "./manifest-schema";

const MANIFEST_PATH = resolve(process.cwd(), "public/__lynx__/manifest.json");

export async function loadLynxExample(name: LynxExampleName) {
  let manifestText: string;
  try {
    manifestText = await readFile(MANIFEST_PATH, "utf8");
  } catch (error) {
    throw new Error(
      `${name}을 렌더링할 Lynx manifest가 없습니다. \`bun run build:lynx-examples\`를 실행하세요.`,
      { cause: error },
    );
  }

  let manifestValue: unknown;
  try {
    manifestValue = JSON.parse(manifestText);
  } catch (error) {
    throw new Error(`${name}을 찾는 중 Lynx manifest JSON 파싱에 실패했습니다.`, { cause: error });
  }

  const manifest = parseLynxExampleManifest(manifestValue);
  const entry = manifest.examples[name];
  if (!entry) {
    throw new Error(
      `${name}이 Lynx manifest에 없습니다. \`bun run build:lynx-examples\`를 실행하세요.`,
    );
  }
  return entry;
}
