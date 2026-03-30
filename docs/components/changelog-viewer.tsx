"use client";

import {
  ChangelogFilterBar,
  ChangelogPackageRail,
} from "@/components/changelog-viewer/changelog-controls";
import { ChangelogGroups } from "@/components/changelog-viewer/changelog-groups";
import { ALL } from "@/components/changelog-viewer/constants";
import { compareSemver } from "@/components/changelog-viewer/utils";
import { useChangelogViewerState } from "@/components/changelog-viewer/use-changelog-viewer-state";
import { resolveAndGroupEntries } from "@/lib/changelog-data";
import type { ChangelogEntry } from "@/lib/parse-changelog";
import { SnackbarProvider } from "seed-design/ui/snackbar";

export function ChangelogViewer({
  entries,
  packages: rawPackages,
}: {
  entries: ChangelogEntry[];
  packages: string[];
}) {
  const state = useChangelogViewerState(rawPackages);
  const data = resolveAndGroupEntries({
    entries,
    packages: state.packages,
    selectedPackage: state.selectedPackage,
    versionFrom: state.versionFrom,
    allValue: ALL,
    compareSemver,
  });

  return (
    <SnackbarProvider>
      <div className="changelog-page flex flex-col gap-6 lg:grid lg:grid-cols-[220px_minmax(0,1fr)] lg:items-start">
        <ChangelogPackageRail
          selectedPackage={state.selectedPackage}
          packages={state.packages}
          switchCompareTab={state.switchCompareTab}
        />
        <div className="min-w-0 flex flex-col gap-6">
          <ChangelogFilterBar
            filteredEntryCount={data.filteredEntryCount}
            selectedPackage={state.selectedPackage}
            setVersionFrom={state.setVersionFrom}
            setVersionFromOpen={state.setVersionFromOpen}
            versionLabel={data.versionLabel}
            versionFrom={state.versionFrom}
            versionFromOpen={state.versionFromOpen}
            versionsForPackage={data.versionsForPackage}
          />
          <ChangelogGroups groupedEntries={data.groupedEntries} />
        </div>
      </div>
    </SnackbarProvider>
  );
}
