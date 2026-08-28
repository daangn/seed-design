export interface DocInfo {
  title: string;
  /** Path relative to the section root, as accepted by `get_doc`. */
  path: string;
  url: string;
  category?: string;
  description?: string;
  deprecated?: boolean;
}

// Icon types
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
