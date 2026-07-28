import { fetchJson, mapWithConcurrency, type FetchImpl } from "./fetch";
import type { ComponentVariantSpec, DeprecatedComponent } from "./types";

interface RootageIndex {
  resources?: Array<{ path?: string }>;
}

interface RootageComponentJson {
  metadata?: { id?: string; name?: string; deprecated?: string };
  data?: {
    schema?: {
      variants?: Record<string, { values?: Record<string, unknown> }>;
    };
  };
}

export interface RootageKnowledge {
  /** 전체 컴포넌트 (deprecated·variants 여부 무관) */
  components: Array<{ id: string; name: string }>;
  deprecatedComponents: DeprecatedComponent[];
  componentVariantSpecs: ComponentVariantSpec[];
}

// 같은 baseUrl로 반복 로드하지 않도록 프로세스 단위로 메모이즈한다.
const cache = new Map<string, Promise<RootageKnowledge>>();

/**
 * seed-design.io rootage 아티팩트에서 컴포넌트 지식을 수집한다.
 * 한 번의 순회로 deprecated 메타와 variants 스키마를 모두 뽑는다.
 */
export function loadRootageKnowledge({
  baseUrl,
  fetchImpl = fetch,
}: {
  baseUrl: string;
  fetchImpl?: FetchImpl;
}): Promise<RootageKnowledge> {
  const cached = cache.get(baseUrl);
  if (cached) return cached;

  const promise = (async (): Promise<RootageKnowledge> => {
    const index = (await fetchJson(`${baseUrl}/rootage/index.json`, fetchImpl)) as RootageIndex;
    const componentPaths = (index.resources ?? [])
      .map((resource) => resource.path)
      .filter((path): path is string => typeof path === "string")
      .filter((path) => path.startsWith("/components/"));

    const components = await mapWithConcurrency(componentPaths, async (path) => {
      return (await fetchJson(`${baseUrl}/rootage${path}`, fetchImpl)) as RootageComponentJson;
    });

    const allComponents: Array<{ id: string; name: string }> = [];
    const deprecatedComponents: DeprecatedComponent[] = [];
    const componentVariantSpecs: ComponentVariantSpec[] = [];

    for (const component of components) {
      const id = component.metadata?.id;
      const name = component.metadata?.name;
      if (!id || !name) continue;

      allComponents.push({ id, name });

      if (component.metadata?.deprecated) {
        deprecatedComponents.push({ id, name, message: component.metadata.deprecated });
      }

      const variantEntries = Object.entries(component.data?.schema?.variants ?? {})
        .map(([variantName, variant]) => [variantName, Object.keys(variant.values ?? {})] as const)
        .filter(([, values]) => values.length > 0);

      if (variantEntries.length > 0) {
        componentVariantSpecs.push({ id, name, variants: Object.fromEntries(variantEntries) });
      }
    }

    return { components: allComponents, deprecatedComponents, componentVariantSpecs };
  })();

  // 실패한 로드는 캐시에 남기지 않는다 — 다음 실행에서 재시도할 수 있어야 한다.
  cache.set(
    baseUrl,
    promise.catch((error) => {
      cache.delete(baseUrl);
      throw error;
    }),
  );

  return cache.get(baseUrl) as Promise<RootageKnowledge>;
}
