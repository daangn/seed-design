/**
 * Sanity의 컴포넌트 상태를 빌드 시작 때 한 번 가져와 `.cache/build-data/sanity.json`에 쓴다.
 * 문서 render(`src/mdx/ProgressBoardTable.astro`, `src/mdx/PlatformStatusTable.astro`)는 이 JSON을
 * `lib/component-status.ts`로 import만 한다.
 *
 * 왜 스냅숏인가: render 중 네트워크를 없애고(요청 1회), JSON이 module graph에 들어가 Sanity 내용이 바뀌면
 * Astro incremental build가 문서 route를 다시 렌더링한다.
 *
 * Sanity 응답 모양을 컴포넌트에 노출하지 않도록 도메인 모양(`ComponentStatus`)으로 바꿔 저장한다.
 * 요청이 실패하면 빈 스냅숏을 쓰고 경고한다. `SEED_DOCS_REQUIRE_SANITY=1`이면 실패로 끝낸다(prod).
 */
import { mkdir, rename, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { createClient } from "@sanity/client";
import { PLATFORM_CONFIG } from "../lib/platform-status";
import type { ComponentStatus, ComponentStatusSnapshot } from "../lib/component-status";
import { apiVersion, dataset, projectId } from "../sanity-studio/env";
import { ALL_COMPONENTS_QUERY } from "../sanity-studio/lib/queries";
import type { ComponentData } from "../sanity-studio/lib/types";

const DOCS_DIRECTORY = resolve(dirname(fileURLToPath(import.meta.url)), "..");
export const SANITY_SNAPSHOT_PATH = resolve(DOCS_DIRECTORY, ".cache/build-data/sanity.json");

export function toComponentStatus(component: ComponentData): ComponentStatus {
  return {
    id: component.id,
    name: component.name,
    ...(component.url ? { url: component.url } : {}),
    platforms: Object.fromEntries(
      PLATFORM_CONFIG.map(({ key }) => {
        const url = component[`${key}Url`];
        const note = component[`${key}Note`];
        return [
          key,
          {
            status: component[`${key}Status`],
            ...(url ? { url } : {}),
            ...(note ? { note } : {}),
          },
        ];
      }),
    ) as ComponentStatus["platforms"],
  };
}

async function fetchComponents(): Promise<ComponentData[]> {
  const client = createClient({ projectId, dataset, apiVersion, useCdn: false });
  return client.fetch<ComponentData[]>(ALL_COMPONENTS_QUERY, {}, { cache: "no-store" });
}

export async function prepareSanitySnapshot(): Promise<ComponentStatusSnapshot> {
  try {
    const components = await fetchComponents();
    return { components: components.map(toComponentStatus) };
  } catch (error) {
    if (process.env.SEED_DOCS_REQUIRE_SANITY === "1") throw error;
    console.warn("[sanity-snapshot] Sanity 조회에 실패해 빈 스냅숏을 씁니다.", error);
    return { components: [] };
  }
}

if (import.meta.main) {
  const snapshot = await prepareSanitySnapshot();
  await mkdir(dirname(SANITY_SNAPSHOT_PATH), { recursive: true });
  // 읽는 쪽이 쓰다 만 JSON을 받지 않도록 임시 파일을 rename해 교체한다.
  const temporaryPath = `${SANITY_SNAPSHOT_PATH}.${process.pid}.tmp`;
  await writeFile(temporaryPath, `${JSON.stringify(snapshot, null, 2)}\n`);
  await rename(temporaryPath, SANITY_SNAPSHOT_PATH);
  console.log(
    `Sanity 컴포넌트 ${snapshot.components.length}개를 ${SANITY_SNAPSHOT_PATH}에 썼습니다.`,
  );
}
