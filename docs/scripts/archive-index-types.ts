export interface DocsItem {
  id: string;
  title: string;
  description?: string;
  docUrl: string;
  deprecated?: boolean;
  snippetKey?: string;
  snippets?: Array<{ label: string; path: string }>;
}
export interface DocsSection {
  id: string;
  label: string;
  items: DocsItem[];
}
export interface DocsCategory {
  id: string;
  label: string;
  sections: DocsSection[];
}
export interface DocsIndex {
  categories: DocsCategory[];
}
