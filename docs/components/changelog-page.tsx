import { ChangelogViewer } from "@/components/changelog-viewer";
import { parseChangelog } from "@/lib/parse-changelog";
import type { ChangelogPlatform } from "@/lib/changelog-platform";
import { Suspense } from "react";

export async function ChangelogPage({ platform }: { platform: ChangelogPlatform }) {
  const entries = await parseChangelog(process.cwd(), platform);
  const packages = [...new Set(entries.map((entry) => entry.package.name))];

  return (
    <Suspense>
      <ChangelogViewer platform={platform} entries={entries} packages={packages} />
    </Suspense>
  );
}
