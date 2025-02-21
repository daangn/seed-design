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

const explorer = cosmiconfig(MODULE_NAME, {
  searchPlaces: [
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

const DEFAULT_CONFIG: Config = {
  data: {
    componentSets: {},
    variables: {},
    styles: {},
  },
};

const searchResult = await explorer.search();

export const config = searchResult ? (searchResult.config as Config) : DEFAULT_CONFIG;

export type Filter<T> = (item: T) => boolean;
export type Transform<T> = (item: T) => MetadataItem;

export const defaultFilter = () => true;
export const defaultTransform = <T>(item: T) => item;
