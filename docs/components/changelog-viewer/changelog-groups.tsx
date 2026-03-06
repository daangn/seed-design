"use client";

import { ChangelogEntryItem } from "@/components/changelog-entry-item";
import { getGroupAnchorId } from "@/components/changelog-viewer/utils";
import { IconSquare2StackedLine } from "@karrotmarket/react-monochrome-icon";
import type { GroupedChangelogEntry } from "@/components/changelog-viewer/use-changelog-viewer-data";
import { Snackbar, useSnackbarAdapter } from "seed-design/ui/snackbar";

export function ChangelogGroups({ groupedEntries }: { groupedEntries: GroupedChangelogEntry[] }) {
  const adapter = useSnackbarAdapter();

  const copyDeepLink = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      adapter.create({
        timeout: 2000,
        onClose: () => {},
        render: () => <Snackbar message="링크가 복사되었습니다" />,
      });
    } catch {}
  };

  return (
    <div className="flex flex-col gap-6">
      {groupedEntries.map((group) => {
        const groupAnchorId = getGroupAnchorId(group.packageName, group.version);
        const groupQueryHref = `/react/updates/changelog?tab=${encodeURIComponent(group.packageName)}&from=${encodeURIComponent(group.version)}`;
        const groupAnchorHref = `${groupQueryHref}#${groupAnchorId}`;
        const groupKey = `${group.packageName}@${group.version}`;
        const absoluteGroupHref =
          typeof window === "undefined"
            ? groupAnchorHref
            : `${window.location.origin}${groupAnchorHref}`;

        return (
          <section
            key={groupKey}
            id={groupAnchorId}
            className="rounded-xl border border-fd-border scroll-mt-24"
          >
            <div className="sticky top-16 z-10 flex items-center justify-between gap-2 flex-wrap border-b border-fd-border px-4 py-2.5 bg-fd-card/95 backdrop-blur supports-[backdrop-filter]:bg-fd-card/80">
              <div className="group/copy inline-flex items-center gap-1.5 min-w-0">
                <span className="text-fd-muted-foreground">📦</span>
                <a
                  href={groupQueryHref}
                  className="truncate text-sm md:text-base font-semibold font-mono hover:text-fd-primary transition-colors"
                >
                  {group.packageName}@{group.version}
                </a>
                <button
                  type="button"
                  className="ml-0.5 shrink-0 text-sm text-fd-muted-foreground opacity-0 group-hover/copy:opacity-100 focus:opacity-100 hover:text-fd-foreground transition-opacity"
                  onClick={() => {
                    void copyDeepLink(absoluteGroupHref);
                  }}
                  aria-label={`${group.packageName}@${group.version} 링크 복사`}
                  title="링크 복사"
                >
                  <IconSquare2StackedLine size={14} aria-hidden />
                </button>
              </div>
              <div className="inline-flex items-center gap-2">
                <span className="text-xs text-fd-muted-foreground shrink-0">
                  {group.entries.length}개 변경사항
                </span>
              </div>
            </div>
            <div className="px-3 py-1">
              <ul className="list-disc pl-5 pr-1 marker:text-fd-muted-foreground">
                {group.entries.map((entry, index) => {
                  const additionalPackages = entry.packages.filter(
                    (pkg) => !(pkg.name === group.packageName && pkg.version === group.version),
                  );
                  const uniqueAdditionalPackages = Array.from(
                    new Map(
                      additionalPackages.map((pkg) => [`${pkg.name}@${pkg.version}`, pkg] as const),
                    ).values(),
                  );

                  return (
                    <li
                      key={`${group.packageName}@${group.version}-${entry.date}-${entry.label ?? ""}-${index}`}
                    >
                      <ChangelogEntryItem entry={entry} hideDate hidePackages compact />
                      {uniqueAdditionalPackages.length > 0 && (
                        <details className="mt-1.5">
                          <summary className="cursor-pointer text-xs text-fd-muted-foreground hover:text-fd-foreground select-none">
                            이 변경으로 함께 업데이트된 패키지 {uniqueAdditionalPackages.length}개
                          </summary>
                          <div className="mt-1.5 flex flex-wrap gap-1.5">
                            {uniqueAdditionalPackages.map((pkg) => {
                              const targetAnchorId = getGroupAnchorId(pkg.name, pkg.version);
                              return (
                                <a
                                  key={`${pkg.name}@${pkg.version}`}
                                  href={`/react/updates/changelog?tab=${encodeURIComponent(pkg.name)}&from=${encodeURIComponent(pkg.version)}#${targetAnchorId}`}
                                  className="inline-flex items-center rounded-md border border-fd-border px-2 py-0.5 text-[11px] font-mono text-fd-muted-foreground hover:text-fd-foreground hover:bg-fd-accent/60 transition-colors"
                                >
                                  <span>{pkg.name}@{pkg.version}</span>
                                </a>
                              );
                            })}
                          </div>
                        </details>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          </section>
        );
      })}
      {groupedEntries.length === 0 && (
        <div className="text-sm text-fd-muted-foreground px-1">조건에 맞는 변경사항이 없습니다.</div>
      )}
    </div>
  );
}
