import { cosmiconfig } from "cosmiconfig";
import type { GenerateComponentSetMetadataOptions } from "../services/component-sets";
import type { GenerateStylesMetadataOptions } from "../services/styles";
import type { GenerateVariablesMetadataOptions } from "../services/variables";
import type { MetadataItem } from "./write";
import { MODULE_NAME } from "../constants";
import type { GenerateComponentMetadataOptions } from "../services/components";

export type Config = {
  fileKey?: string;
  personalAccessToken?: string;
  data?: {
    components?: GenerateComponentMetadataOptions;
    componentSets?: GenerateComponentSetMetadataOptions;
    variables?: GenerateVariablesMetadataOptions;
    styles?: GenerateStylesMetadataOptions;
  };
};

const DEFAULT_CONFIG: Config = {
  data: {
    componentSets: {},
    variables: {},
    styles: {},
  },
};

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
    console.warn(
      `${configPath ? `${configPath} 설정 파일을 사용할 수 없습니다. ` : ""}기본 설정을 사용합니다.`,
    );

    return DEFAULT_CONFIG;
  }

  console.log(`${searchResult.filepath} 설정 파일을 사용합니다.`);

  return searchResult.config;
}

export type Filter<T> = (item: T) => boolean;
export type Transform<T> = (item: T) => MetadataItem;

export const defaultFilter = () => true;
export const defaultTransform = <T>(item: T) => item;
