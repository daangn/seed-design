import { createClient } from "@sanity/client";
import { SANITY_COMPONENTS_PATH, writeSanityComponents } from "@/lib/llms/sanity-components";
import { apiVersion, dataset, projectId } from "@/sanity-studio/env";
import { ALL_COMPONENTS_QUERY } from "@/sanity-studio/lib/queries";
import type { ComponentData } from "@/sanity-studio/lib/types";

const startedAt = performance.now();
const components = await createClient({ projectId, dataset, apiVersion, useCdn: false }).fetch<
  ComponentData[]
>(ALL_COMPONENTS_QUERY);

// An empty list would go out as missing status tables on every component page, which is the
// failure this step exists to stop reaching the build quietly.
if (components.length === 0) {
  throw new Error(`Sanity가 컴포넌트를 하나도 돌려주지 않았습니다: ${projectId}/${dataset}`);
}

await writeSanityComponents(components);

console.log(
  `Sanity 컴포넌트 데이터 저장 완료 (${Math.round(performance.now() - startedAt)}ms): ${components.length}개 → ${SANITY_COMPONENTS_PATH}`,
);
