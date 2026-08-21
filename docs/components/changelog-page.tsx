import { ChangelogViewer } from "@/components/changelog-viewer";
import { parseChangelog } from "@/lib/parse-changelog";
import { Suspense } from "react";

export async function ChangelogPage() {
  const entries = await parseChangelog(process.cwd());
  const packages = [...new Set(entries.map((entry) => entry.package.name))];

  return (
    <Suspense>
      <ChangelogViewer entries={entries} packages={packages} />
    </Suspense>
  );
}
