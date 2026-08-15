"use client";

import { useMemo } from "react";
import {
  COMPONENT_SEARCH_API,
  type ComponentSearchEntry,
  matchComponents,
} from "@/lib/component-search";
import { useSearchIndex } from "./use-search-index";

const NO_MATCHES: ComponentSearchEntry[] = [];

/**
 * Component documents matching the search query. `pending` is the index still being fetched:
 * the results card waits on it so the blocks arrive together, rather than this one dropping in
 * later and pushing the document results down the page someone is already reading.
 */
export function useComponentSearch({ search, enabled }: { search: string; enabled: boolean }) {
  const active = enabled && search.trim() !== "";
  const entries = useSearchIndex<ComponentSearchEntry>(COMPONENT_SEARCH_API, active);

  const matches = useMemo(
    () => (active && entries ? matchComponents(entries, search) : NO_MATCHES),
    [active, entries, search],
  );

  return { matches, pending: active && !entries };
}
