import type { ReactNode } from "react";
import { SearchError } from "./error";
import { SearchLoading } from "./loading";

interface SearchResultsStateProps {
  search: string;
  error: unknown;
  isLoading: boolean;
  recent: ReactNode;
  children: ReactNode;
}

export function SearchResultsState({
  search,
  error,
  isLoading,
  recent,
  children,
}: SearchResultsStateProps) {
  if (search.trim() === "") return recent;
  if (error) return <SearchError />;
  if (isLoading) return <SearchLoading />;
  return children;
}
