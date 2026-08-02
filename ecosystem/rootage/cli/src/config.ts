import type { typescript } from "@seed-design/rootage-core";
import { cosmiconfig } from "cosmiconfig";

/** 생성되는 `.d.ts` 앞에 붙일 주석과, 제외할 spec 목록. */
export interface DtsBanner {
  content: string;
  /** 배너를 붙이지 않을 component spec id 목록. */
  ignore?: string[];
}

export interface RootageConfig {
  prefix?: string;
  tokenCss?: {
    generator?: string;
  };
  componentSpec?: {
    dtsBanner?: DtsBanner;
  };
}

function fail(filepath: string, message: string): never {
  throw new Error(`Invalid rootage config at ${filepath}: ${message}`);
}

function validateDtsBanner(value: unknown, filepath: string): DtsBanner {
  if (typeof value !== "object" || value === null) {
    fail(filepath, "componentSpec.dtsBanner must be an object");
  }

  const { content, ignore } = value as Record<string, unknown>;

  if (typeof content !== "string") {
    fail(filepath, "componentSpec.dtsBanner.content must be a string");
  }

  if (
    ignore !== undefined &&
    (!Array.isArray(ignore) || ignore.some((id) => typeof id !== "string"))
  ) {
    fail(filepath, "componentSpec.dtsBanner.ignore must be an array of strings");
  }

  return { content, ignore: ignore as string[] | undefined };
}

function validateConfig(value: unknown, filepath: string): RootageConfig {
  if (typeof value !== "object" || value === null) {
    fail(filepath, "config must export an object");
  }

  const { prefix, tokenCss, componentSpec } = value as Record<string, unknown>;

  if (prefix !== undefined && typeof prefix !== "string") {
    fail(filepath, "prefix must be a string");
  }

  const generator = (tokenCss as Record<string, unknown> | undefined)?.generator;
  if (generator !== undefined && typeof generator !== "string") {
    fail(filepath, "tokenCss.generator must be a string");
  }

  const dtsBanner = (componentSpec as Record<string, unknown> | undefined)?.dtsBanner;

  return {
    prefix,
    tokenCss: { generator: generator as string | undefined },
    componentSpec: {
      dtsBanner: dtsBanner === undefined ? undefined : validateDtsBanner(dtsBanner, filepath),
    },
  };
}

/**
 * `rootage.config.mjs`를 읽는다. 탐색 범위는 cwd 한 디렉토리이며,
 * 패키지마다 자기 디렉토리에서 CLI를 돌리므로 상위로 올라가지 않는 게 맞다.
 */
export async function loadConfig(configPath?: string): Promise<RootageConfig> {
  const explorer = cosmiconfig("rootage");
  const result = configPath ? await explorer.load(configPath) : await explorer.search();

  if (!result || result.isEmpty) return {};

  return validateConfig(result.config, result.filepath);
}

/** 선언적 배너 설정을 core가 받는 함수 형태로 바꾼다. */
export function composeDtsBanner(banner: DtsBanner): typescript.ComponentSpecDtsBanner {
  const ignored = new Set(banner.ignore ?? []);

  return (decl) => (ignored.has(decl.id) ? undefined : banner.content);
}
