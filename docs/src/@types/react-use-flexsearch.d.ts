/* eslint-disable no-unused-vars */
type Status = "todo" | "in-progress" | "done";
interface QueryResultItem {
  name: string;
  status?: Status;
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
