"use client";

import { ChangelogEntryItem } from "@/components/changelog-entry-item";
import { getGroupAnchorId } from "@/components/changelog-viewer/utils";
import { IconSquare2StackedLine } from "@karrotmarket/react-monochrome-icon";
import type { GroupedChangelogEntry } from "@/components/changelog-viewer/use-changelog-viewer-data";
import { Snackbar, useSnackbarAdapter } from "seed-design/ui/snackbar";

function extractTopLevelHtml(html: string): string {
  return html.replace(/<ul>[\s\S]*$/, "").trim();
}

export function ChangelogGroups({
  groupedEntries,
}: {
  groupedEntries: GroupedChangelogEntry[];
}) {
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
            className="rounded-xl border border-fd-border scroll-mt-24 overflow-clip"
          >
            <div className="sticky top-16 z-10 flex items-center justify-between gap-2 flex-wrap border-b border-fd-border px-4 h-10 bg-fd-card/95 backdrop-blur supports-[backdrop-filter]:bg-fd-card/80 rounded-t-xl">
              <div className="group/copy inline-flex items-center gap-1.5 min-w-0">
                <span className="text-fd-muted-foreground">📦</span>
                <a
                  href={groupQueryHref}
                  className="truncate text-xs md:text-sm font-semibold font-mono hover:text-fd-primary transition-colors"
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
                  const { resolvedRelatedPackages } = entry;

                  //NOTE: 하위 패키지 업데이트에 의한 버전 변경 항목 표시
                  if (entry.isDependencyOnly) {
                    return (
                      <li key={`${group.packageName}@${group.version}-${entry.order}-${index}`}>
                        <span className="text-xs text-fd-muted-foreground">
                          하위 패키지 업데이트에 의한 버전 변경
                        </span>
                        {resolvedRelatedPackages.length > 0 && (
                          <div className="mt-1.5 flex flex-col gap-1.5">
                            {resolvedRelatedPackages.map((pkg) => (
                              <div key={`${pkg.name}@${pkg.version}`}>
                                <a
                                  href={`/react/updates/changelog?tab=${encodeURIComponent(pkg.name)}&from=${encodeURIComponent(pkg.version)}`}
                                  className="inline-flex items-center rounded-md border border-fd-border px-2 py-0.5 text-[11px] font-mono text-fd-muted-foreground hover:text-fd-foreground hover:bg-fd-accent/60 transition-colors"
                                >
                                  {pkg.name}@{pkg.version}
                                </a>
                                {pkg.resolvedEntries.length > 0 && (
                                  <ul className="mt-1 list-disc pl-5 marker:text-fd-muted-foreground">
                                    {pkg.resolvedEntries.map((e) => {
                                      const topHtml = extractTopLevelHtml(e.contentHtml);
                                      if (!topHtml) return null;
                                      return (
                                        <li
                                          key={e.order}
                                          className="text-xs text-fd-muted-foreground [&_a]:text-fd-muted-foreground [&_a]:underline"
                                          // biome-ignore lint/security/noDangerouslySetInnerHtml: 파싱된 마크다운 HTML
                                          dangerouslySetInnerHTML={{ __html: topHtml }}
                                        />
                                      );
                                    })}
                                  </ul>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </li>
                    );
                  }

                  return (
                    <li key={`${group.packageName}@${group.version}-${entry.order}-${index}`}>
                      <ChangelogEntryItem
                        entry={entry}
                        hidePackages
                        compact
                        showPackage={entry.package.name !== group.packageName}
                      />
                      {resolvedRelatedPackages.length > 0 && (
                        <details className="mt-1.5">
                          <summary className="cursor-pointer text-xs text-fd-muted-foreground hover:text-fd-foreground select-none">
                            이 변경으로 함께 업데이트된 패키지 {resolvedRelatedPackages.length}개
                          </summary>
                          <div className="mt-1.5 flex flex-col gap-1.5">
                            {resolvedRelatedPackages.map((pkg) => (
                              <div key={`${pkg.name}@${pkg.version}`}>
                                <a
                                  href={`/react/updates/changelog?tab=${encodeURIComponent(pkg.name)}&from=${encodeURIComponent(pkg.version)}`}
                                  className="inline-flex items-center rounded-md border border-fd-border px-2 py-0.5 text-[11px] font-mono text-fd-muted-foreground hover:text-fd-foreground hover:bg-fd-accent/60 transition-colors"
                                >
                                  {pkg.name}@{pkg.version}
                                </a>
                                {pkg.resolvedEntries.length > 0 && (
                                  <ul className="mt-1 list-disc pl-5 marker:text-fd-muted-foreground">
                                    {pkg.resolvedEntries.map((e) => {
                                      const topHtml = extractTopLevelHtml(e.contentHtml);
                                      if (!topHtml) return null;
                                      return (
                                        <li
                                          key={e.order}
                                          className="text-xs text-fd-muted-foreground [&_a]:text-fd-muted-foreground [&_a]:underline"
                                          // biome-ignore lint/security/noDangerouslySetInnerHtml: 파싱된 마크다운 HTML
                                          dangerouslySetInnerHTML={{ __html: topHtml }}
                                        />
                                      );
                                    })}
                                  </ul>
                                )}
                              </div>
                            ))}
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
        <div className="text-sm text-fd-muted-foreground px-1">
          조건에 맞는 변경사항이 없습니다.
        </div>
      )}
    </div>
  );
}
