"use client";

import { ChangelogFilterBar } from "@/components/changelog-viewer/changelog-controls";
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
      {/* `changelog-page` pairs with the unlayered `article .prose` / `.changelog-page .prose`
          rules in global.css: it zeroes the doc-wide 3rem prose bottom padding for the
          changelog's entry bodies. Kept as a global rule (not an inline utility) because a
          Tailwind utility lives in `@layer utilities` and can't beat that unlayered layout rule. */}
      <div className="changelog-page w-full max-w-[960px] min-w-0">
        <ChangelogFilterBar
          filteredEntryCount={data.filteredEntryCount}
          selectedPackage={state.selectedPackage}
          packages={state.packages}
          setVersionFrom={state.setVersionFrom}
          setVersionFromOpen={state.setVersionFromOpen}
          switchCompareTab={state.switchCompareTab}
          versionLabel={data.versionLabel}
          versionFrom={state.versionFrom}
          versionFromOpen={state.versionFromOpen}
          versionsForPackage={data.versionsForPackage}
        />
        <ChangelogGroups groupedEntries={data.groupedEntries} />
      </div>
    </SnackbarProvider>
  );
}
