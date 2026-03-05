"use client";

import { ChangelogControls } from "@/components/changelog-viewer/changelog-controls";
import { ChangelogGroups } from "@/components/changelog-viewer/changelog-groups";
import { useChangelogViewerData } from "@/components/changelog-viewer/use-changelog-viewer-data";
import { useChangelogViewerState } from "@/components/changelog-viewer/use-changelog-viewer-state";
import type { ChangelogEntry } from "@/lib/parse-changelog";

export function ChangelogViewer({
  entries,
  packages: rawPackages,
}: {
  entries: ChangelogEntry[];
  packages: string[];
}) {
  const state = useChangelogViewerState(rawPackages);
  const data = useChangelogViewerData({
    entries,
    exactVersion: state.exactVersion,
    filterMode: state.filterMode,
    legacyVersion: state.legacyVersion,
    packages: state.packages,
    selectedPackageForView: state.selectedPackageForView,
    versionFrom: state.versionFrom,
    versionTo: state.versionTo,
  });

  return (
    <div className="flex flex-col gap-6">
      <ChangelogControls
        addCompareTab={state.addCompareTab}
        addCompareTabOpen={state.addCompareTabOpen}
        availableCompareTabsToAdd={state.availableCompareTabsToAdd}
        compareTabs={state.compareTabs}
        effectiveCompareTab={state.effectiveCompareTab}
        exactLabel={data.exactLabel}
        exactVersion={state.exactVersion}
        exactVersionOpen={state.exactVersionOpen}
        filteredEntryCount={data.filteredEntries.length}
        fromLabel={data.fromLabel}
        isCompareMode={state.isCompareMode}
        isExactMode={data.isExactMode}
        packageLabel={data.packageLabel}
        packageLatestVersionMap={data.packageLatestVersionMap}
        packageOpen={state.packageOpen}
        packages={state.packages}
        removeCompareTab={state.removeCompareTab}
        selectedPackageForView={state.selectedPackageForView}
        setActiveCompareTab={state.setActiveCompareTab}
        setAddCompareTabOpen={state.setAddCompareTabOpen}
        setExactVersion={state.setExactVersion}
        setExactVersionOpen={state.setExactVersionOpen}
        setFilterMode={state.setFilterMode}
        setLegacyVersion={state.setLegacyVersion}
        setPackageOpen={state.setPackageOpen}
        setSelectedPackage={state.setSelectedPackage}
        setVersionFrom={state.setVersionFrom}
        setVersionFromOpen={state.setVersionFromOpen}
        setVersionTo={state.setVersionTo}
        setVersionToOpen={state.setVersionToOpen}
        setViewMode={state.setViewMode}
        switchCompareTab={state.switchCompareTab}
        toLabel={data.toLabel}
        versionFrom={state.versionFrom}
        versionFromOpen={state.versionFromOpen}
        versionTo={state.versionTo}
        versionToOpen={state.versionToOpen}
        versionsForPackage={data.versionsForPackage}
      />
      <ChangelogGroups groupedEntries={data.groupedEntries} />
    </div>
  );
}
