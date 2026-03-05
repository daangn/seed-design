import type { SectionId } from "./config.js";

export interface SectionCategoryInfo {
  id: string;
  description: string;
}

export interface SectionInfo {
  id: SectionId;
  name: string;
  description: string;
  overviewTxtUrl: string;
  fullTxtUrl: string;
  categories: SectionCategoryInfo[];
}

export interface DocInfo {
  title: string;
  path: string;
  txtUrl: string;
  category?: string;
}

export interface SearchDocResult extends DocInfo {
  section: SectionId;
  score: number;
}

export interface RootageIndex {
  name: string;
  version: string;
  resources: Array<{ path: string }>;
}

export interface IconEntry {
  name: string;
  metadatas: string[];
  variant?: "line" | "fill";
  service?: string;
}

export interface IconIndex {
  version: string;
  generatedAt: string;
  monochrome: IconEntry[];
  multicolor: IconEntry[];
}

export interface IconSearchResult {
  name: string;
  type: "monochrome" | "multicolor";
  variant?: "line" | "fill";
  service?: string;
  matchedKeywords: string[];
  allKeywords: string[];
}

export interface IconUsage {
  framework: string;
  package: string;
  import: string;
  component: string;
}

export interface IconDetails {
  name: string;
  type: "monochrome" | "multicolor";
  keywords: string[];
  variant?: "line" | "fill";
  service?: string;
  docsUrl: string;
  usage: IconUsage[];
}
