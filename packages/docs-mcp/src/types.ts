export interface DocInfo {
  title: string;
  /** Path relative to the section root, as accepted by `get_doc`. */
  path: string;
  url: string;
  description?: string;
  deprecated?: boolean;
}
