"use client";

import { DEFAULT_COMPARE_PACKAGES, PINNED_PACKAGES, ALL } from "@/components/changelog-viewer/constants";
import { parseAsArrayOf, parseAsString, useQueryState } from "nuqs";
import { useEffect, useMemo, useState } from "react";

type FilterMode = "range" | "exact";

type TabFilter = {
  exact: string;
  from: string;
  mode: FilterMode;
  to: string;
  version: string;
};

type TabFilterMap = Record<string, TabFilter>;

const DEFAULT_TAB_FILTER: TabFilter = {
  mode: "range",
  exact: ALL,
  from: ALL,
  to: ALL,
  version: ALL,
};

function normalizeTabFilter(input?: Partial<TabFilter>): TabFilter {
  return {
    mode: input?.mode === "exact" ? "exact" : "range",
    exact: input?.exact ?? ALL,
    from: input?.from ?? ALL,
    to: input?.to ?? ALL,
    version: input?.version ?? ALL,
  };
}

function toQueryValue(value: string): string | null {
  return value === ALL ? null : value;
}

function isSameFilter(a: TabFilter, b: TabFilter) {
  return (
    a.mode === b.mode &&
    a.exact === b.exact &&
    a.from === b.from &&
    a.to === b.to &&
    a.version === b.version
  );
}

export function useChangelogViewerState(rawPackages: string[]) {
  const packages = useMemo(
    () => [
      ...PINNED_PACKAGES.filter((pkg) => rawPackages.includes(pkg)),
      ...rawPackages.filter((pkg) => !PINNED_PACKAGES.includes(pkg)).sort(),
    ],
    [rawPackages],
  );

  const [compareTabsState, setCompareTabsState] = useQueryState(
    "tabs",
    parseAsArrayOf(parseAsString).withDefault([]).withOptions({ history: "push" }),
  );
  const [activeCompareTab, setActiveCompareTab] = useQueryState("tab", {
    defaultValue: "",
    history: "push",
  });
  const [versionFrom, setVersionFromRaw] = useQueryState("from", {
    defaultValue: ALL,
    history: "push",
  });
  const [versionTo, setVersionToRaw] = useQueryState("to", {
    defaultValue: ALL,
    history: "push",
  });
  const [exactVersion, setExactVersionRaw] = useQueryState("exact", {
    defaultValue: ALL,
    history: "push",
  });
  const [legacyVersion, setLegacyVersionRaw] = useQueryState("version", {
    defaultValue: ALL,
    history: "push",
  });
  const [filterMode, setFilterModeRaw] = useQueryState("mode", {
    defaultValue: "range",
    history: "push",
  });

  const [tabFilters, setTabFilters] = useState<TabFilterMap>({});

  const [addCompareTabOpen, setAddCompareTabOpen] = useState(false);
  const [exactVersionOpen, setExactVersionOpen] = useState(false);
  const [versionFromOpen, setVersionFromOpen] = useState(false);
  const [versionToOpen, setVersionToOpen] = useState(false);

  const baseCompareTabs =
    compareTabsState.length > 0
      ? compareTabsState.filter((pkg) => packages.includes(pkg))
      : DEFAULT_COMPARE_PACKAGES.filter((pkg) => packages.includes(pkg));
  const compareTabs =
    activeCompareTab &&
    packages.includes(activeCompareTab) &&
    !baseCompareTabs.includes(activeCompareTab)
      ? [...baseCompareTabs, activeCompareTab]
      : baseCompareTabs;
  const effectiveCompareTab = compareTabs.includes(activeCompareTab)
    ? activeCompareTab
    : compareTabs[0] ?? ALL;
  const selectedPackageForView = effectiveCompareTab;
  const availableCompareTabsToAdd = packages.filter((pkg) => !compareTabs.includes(pkg));

  const currentFilter: TabFilter = normalizeTabFilter({
    mode: filterMode === "exact" ? "exact" : "range",
    exact: exactVersion,
    from: versionFrom,
    to: versionTo,
    version: legacyVersion,
  });

  const applyTabFilter = (filter: TabFilter) => {
    void setFilterModeRaw(filter.mode);
    void setExactVersionRaw(toQueryValue(filter.exact));
    void setVersionFromRaw(toQueryValue(filter.from));
    void setVersionToRaw(toQueryValue(filter.to));
    void setLegacyVersionRaw(toQueryValue(filter.version));
  };

  // 현재 활성 탭의 필터를 메모리 상태에 계속 저장
  useEffect(() => {
    if (!effectiveCompareTab || effectiveCompareTab === ALL) return;

    setTabFilters((prev) => {
      const prevFilter = prev[effectiveCompareTab];
      if (prevFilter && isSameFilter(prevFilter, currentFilter)) return prev;
      return {
        ...prev,
        [effectiveCompareTab]: currentFilter,
      };
    });
  }, [currentFilter, effectiveCompareTab]);

  const setFilterMode = (value: string | null) => {
    void setFilterModeRaw(value === "exact" ? "exact" : "range");
  };

  const setExactVersion = (value: string | null) => {
    void setExactVersionRaw(value);
  };

  const setVersionFrom = (value: string | null) => {
    void setVersionFromRaw(value);
  };

  const setVersionTo = (value: string | null) => {
    void setVersionToRaw(value);
  };

  const setLegacyVersion = (value: string | null) => {
    void setLegacyVersionRaw(value);
  };

  const switchCompareTab = (pkg: string) => {
    applyTabFilter(normalizeTabFilter(tabFilters[pkg]));
    void setActiveCompareTab(pkg);
  };

  const addCompareTab = (pkg: string) => {
    const nextTabs = compareTabs.includes(pkg) ? compareTabs : [...compareTabs, pkg];
    void setCompareTabsState(nextTabs);
    applyTabFilter(normalizeTabFilter(tabFilters[pkg]));
    void setActiveCompareTab(pkg);
    setAddCompareTabOpen(false);
  };

  const removeCompareTab = (pkg: string) => {
    const nextTabs = compareTabs.filter((tab) => tab !== pkg);
    void setCompareTabsState(nextTabs.length > 0 ? nextTabs : null);
    if (effectiveCompareTab === pkg) {
      const nextTab = nextTabs[0] ?? "";
      applyTabFilter(normalizeTabFilter(tabFilters[nextTab]));
      void setActiveCompareTab(nextTab);
    }
  };

  return {
    activeCompareTab,
    addCompareTab,
    addCompareTabOpen,
    availableCompareTabsToAdd,
    compareTabs,
    effectiveCompareTab,
    exactVersion,
    exactVersionOpen,
    filterMode,
    legacyVersion,
    packages,
    removeCompareTab,
    selectedPackageForView,
    setActiveCompareTab,
    setAddCompareTabOpen,
    setExactVersion,
    setExactVersionOpen,
    setFilterMode,
    setLegacyVersion,
    setVersionFrom,
    setVersionFromOpen,
    setVersionTo,
    setVersionToOpen,
    switchCompareTab,
    versionFrom,
    versionFromOpen,
    versionTo,
    versionToOpen,
  };
}
