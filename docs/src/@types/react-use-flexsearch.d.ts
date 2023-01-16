/* eslint-disable no-unused-vars */
interface QueryResultItem {
  id: string;
  name: string;
  slug: string;
}

declare module "react-use-flexsearch" {
  export function useFlexSearch(
    query: string,
    index: any,
    store: any,
    options?: any,
  ): QueryResultItem[];
}
