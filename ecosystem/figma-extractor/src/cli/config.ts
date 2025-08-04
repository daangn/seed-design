import { cosmiconfig } from "cosmiconfig";
import { MODULE_NAME } from "../constants";
import type { Pipeline } from "../pipeline/builder";

export interface Config {
  fileKey?: string;
  personalAccessToken?: string;
  pipelines: Record<string, Pipeline>;
}

export function createConfig(config: Config) {
  return config;
}

export async function loadConfig(configPath?: string): Promise<Config> {
  const explorer = cosmiconfig(MODULE_NAME, {
    searchPlaces: configPath
      ? [configPath]
      : [
          `.config/${MODULE_NAME}.js`,
          `.config/${MODULE_NAME}.ts`,
          `.config/${MODULE_NAME}.mjs`,
          `.config/${MODULE_NAME}.cjs`,
          `${MODULE_NAME}.config.js`,
          `${MODULE_NAME}.config.ts`,
          `${MODULE_NAME}.config.mjs`,
          `${MODULE_NAME}.config.cjs`,
        ],
  });

  const searchResult = await explorer.search();

  if (!searchResult) {
    if (!configPath) {
      throw new Error(
        `설정 파일을 찾을 수 없습니다. ${MODULE_NAME}.config.ts 설정 파일을 생성하거나 --config로 설정 파일을 지정해주세요.`,
      );
    }

    throw new Error(`${configPath} 설정 파일이 존재하지 않습니다.`);
  }

  console.log(`${searchResult.filepath} 설정 파일을 사용합니다.`);

  return searchResult.config;
}
