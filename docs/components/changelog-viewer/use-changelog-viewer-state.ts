"use client";

import { DEFAULT_COMPARE_PACKAGES, PINNED_PACKAGES, ALL } from "@/components/changelog-viewer/constants";
import { parseAsArrayOf, parseAsString, useQueryState } from "nuqs";
import { useMemo, useState } from "react";

export function useChangelogViewerState(rawPackages: string[]) {
  const packages = useMemo(
    () => [
      ...PINNED_PACKAGES.filter((pkg) => rawPackages.includes(pkg)),
      ...rawPackages.filter((pkg) => !PINNED_PACKAGES.includes(pkg)).sort(),
    ],
    [rawPackages],
  );

  const [selectedPackage, setSelectedPackage] = useQueryState("package", {
    defaultValue: ALL,
    history: "push",
  });
  const [viewMode, setViewMode] = useQueryState("view", {
    defaultValue: "single",
    history: "push",
  });
  const [compareTabsState, setCompareTabsState] = useQueryState(
    "tabs",
    parseAsArrayOf(parseAsString).withDefault([]).withOptions({ history: "push" }),
  );
  const [activeCompareTab, setActiveCompareTab] = useQueryState("tab", {
    defaultValue: "",
    history: "push",
  });
  const [versionFrom, setVersionFrom] = useQueryState("from", {
    defaultValue: ALL,
    history: "push",
  });
  const [versionTo, setVersionTo] = useQueryState("to", {
    defaultValue: ALL,
    history: "push",
  });
  const [exactVersion, setExactVersion] = useQueryState("exact", {
    defaultValue: ALL,
    history: "push",
  });
  const [legacyVersion, setLegacyVersion] = useQueryState("version", {
    defaultValue: ALL,
    history: "push",
  });
  const [filterMode, setFilterMode] = useQueryState("mode", {
    defaultValue: "range",
    history: "push",
  });

  const [addCompareTabOpen, setAddCompareTabOpen] = useState(false);
  const [packageOpen, setPackageOpen] = useState(false);
  const [exactVersionOpen, setExactVersionOpen] = useState(false);
  const [versionFromOpen, setVersionFromOpen] = useState(false);
  const [versionToOpen, setVersionToOpen] = useState(false);

  const isCompareMode = viewMode === "compare";
  const compareTabs =
    compareTabsState.length > 0
      ? compareTabsState.filter((pkg) => packages.includes(pkg))
      : DEFAULT_COMPARE_PACKAGES.filter((pkg) => packages.includes(pkg));
  const effectiveCompareTab = compareTabs.includes(activeCompareTab)
    ? activeCompareTab
    : compareTabs[0] ?? ALL;
  const selectedPackageForView = isCompareMode ? effectiveCompareTab : selectedPackage;
  const availableCompareTabsToAdd = packages.filter((pkg) => !compareTabs.includes(pkg));

  const switchCompareTab = (pkg: string) => {
    void setActiveCompareTab(pkg);
  };

  const addCompareTab = (pkg: string) => {
    const nextTabs = compareTabs.includes(pkg) ? compareTabs : [...compareTabs, pkg];
    void setCompareTabsState(nextTabs);
    void setActiveCompareTab(pkg);
    setAddCompareTabOpen(false);
  };

  const removeCompareTab = (pkg: string) => {
    const nextTabs = compareTabs.filter((tab) => tab !== pkg);
    void setCompareTabsState(nextTabs.length > 0 ? nextTabs : null);
    if (effectiveCompareTab === pkg) {
      void setActiveCompareTab(nextTabs[0] ?? "");
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
    isCompareMode,
    legacyVersion,
    packageOpen,
    packages,
    removeCompareTab,
    selectedPackageForView,
    setActiveCompareTab,
    setAddCompareTabOpen,
    setExactVersion,
    setExactVersionOpen,
    setFilterMode,
    setLegacyVersion,
    setPackageOpen,
    setSelectedPackage,
    setVersionFrom,
    setVersionFromOpen,
    setVersionTo,
    setVersionToOpen,
    setViewMode,
    switchCompareTab,
    versionFrom,
    versionFromOpen,
    versionTo,
    versionToOpen,
  };
}
