import type { GeneratorFunction } from "./generator";
import type { ModelKind } from "./parser/authoring/types";

export interface GeneratedFile {
  path: string;
  code: string;
  type: "dts" | "mjs" | "css" | "json" | "ts";
  /** 파일을 낳은 스펙의 kind. 집계 파일(index 등)엔 없다. */
  kind?: ModelKind;
  /** 파일이 단일 선언에 대응할 때의 id. */
  id?: string;
}

export interface PluginContext {
  prefix?: string;
}

export interface RootagePlugin {
  name: string;
  /** string 반환 시 파일 내용 교체, undefined면 그대로. */
  transform?: (
    file: GeneratedFile,
    ctx: PluginContext,
  ) => string | undefined | Promise<string | undefined>;
  /** token-css 생성기 교체. 첫 번째 제공자가 이긴다. */
  tokenCssGenerator?: GeneratorFunction;
}

export interface RootageConfig {
  prefix?: string;
  plugins?: RootagePlugin[];
}
