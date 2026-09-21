import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import type { ComponentData } from "@/sanity-studio/lib/types";

/**
 * 컴포넌트별 플랫폼 상태. `scripts/prepare-sanity-components.ts`가 빌드 전에 Sanity에서 받아 둔다.
 *
 * 문서별 마크다운을 내는 라우트 안에서는 Sanity를 직접 조회할 수 없다. `output: "export"`는
 * 라우트 핸들러의 `dynamic`을 `force-static`까지 무시하고 `"error"`로 고정하므로,
 * `cache: "no-store"` 조회는 `NEXT_STATIC_GEN_BAILOUT`으로 끝난다. 캐시를 허용하면 Next가 응답을
 * `.next/cache`에 두고, CI가 복원한 그 캐시에서 지난 데이터가 나간다.
 */
export const SANITY_COMPONENTS_PATH = path.resolve(process.cwd(), ".cache/sanity/components.json");

export async function readSanityComponents(): Promise<ComponentData[]> {
  try {
    return JSON.parse(await readFile(SANITY_COMPONENTS_PATH, "utf-8")) as ComponentData[];
  } catch (error) {
    throw new Error(
      `Sanity 컴포넌트 데이터를 읽지 못했습니다: ${SANITY_COMPONENTS_PATH}. \`bun run prepare:sanity-components\`를 먼저 실행하세요.`,
      { cause: error },
    );
  }
}

export async function writeSanityComponents(components: ComponentData[]) {
  await mkdir(path.dirname(SANITY_COMPONENTS_PATH), { recursive: true });
  await writeFile(SANITY_COMPONENTS_PATH, JSON.stringify(components), "utf-8");
}
