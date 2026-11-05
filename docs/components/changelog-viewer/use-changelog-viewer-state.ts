"use client";

import {
  PINNED_PACKAGES,
  LYNX_PINNED_PACKAGES,
  ALL,
} from "@/components/changelog-viewer/constants";
import type { ChangelogPlatform } from "@/lib/changelog-platform";
import { useQueryState } from "nuqs";
import { useEffect, useMemo, useState } from "react";

type TabFilterMap = Record<string, string>;

function toQueryValue(value: string): string | null {
  return value === ALL ? null : value;
}

export function useChangelogViewerState(rawPackages: string[], platform: ChangelogPlatform) {
  const packages = useMemo(() => {
    const pinned = platform === "lynx" ? LYNX_PINNED_PACKAGES : PINNED_PACKAGES;
    return [
      ...pinned.filter((pkg) => rawPackages.includes(pkg)),
      ...rawPackages.filter((pkg) => !pinned.includes(pkg)).sort(),
    ];
  }, [rawPackages, platform]);

  const [activeTab, setActiveTab] = useQueryState("package", {
    defaultValue: "",
    history: "push",
  });
  const [versionFrom, setVersionFromRaw] = useQueryState("version", {
    defaultValue: ALL,
    history: "push",
  });

  const [tabFilters, setTabFilters] = useState<TabFilterMap>({});
  const [versionFromOpen, setVersionFromOpen] = useState(false);

  const selectedPackage = packages.includes(activeTab) ? activeTab : (packages[0] ?? ALL);

  // 현재 활성 탭의 필터를 메모리 상태에 계속 저장
  useEffect(() => {
    if (!selectedPackage || selectedPackage === ALL) return;

    setTabFilters((prev) => {
      if (prev[selectedPackage] === versionFrom) return prev;
      return {
        ...prev,
        [selectedPackage]: versionFrom,
      };
    });
  }, [selectedPackage, versionFrom]);

  const setVersionFrom = (value: string | null) => {
    void setVersionFromRaw(value);
  };

  const switchCompareTab = (pkg: string) => {
    void setVersionFromRaw(toQueryValue(tabFilters[pkg] ?? ALL));
    void setActiveTab(pkg);
  };

  return {
    packages,
    selectedPackage,
    setVersionFrom,
    setVersionFromOpen,
    switchCompareTab,
    versionFrom,
    versionFromOpen,
  };
}
