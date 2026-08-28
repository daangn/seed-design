export interface DocInfo {
  title: string;
  /** Path relative to the section root, as accepted by `get_doc`. */
  path: string;
  url: string;
  /** The section the item is filed under. `fetchDocsList` always knows it. */
  category: string;
  description?: string;
  deprecated?: boolean;
}
