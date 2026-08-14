"use client";

import { useMemo } from "react";
import {
  COMPONENT_SEARCH_API,
  type ComponentSearchEntry,
  matchComponents,
} from "@/lib/component-search";
import { useSearchIndex } from "./use-search-index";

const NO_MATCHES: ComponentSearchEntry[] = [];

/** Component documents matching the search query. */
export function useComponentSearch({ search, enabled }: { search: string; enabled: boolean }) {
  const active = enabled && search.trim() !== "";
  const entries = useSearchIndex<ComponentSearchEntry>(COMPONENT_SEARCH_API, active);

  return useMemo(
    () => (active && entries ? matchComponents(entries, search) : NO_MATCHES),
    [active, entries, search],
  );
}
