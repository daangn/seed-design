"use client";

import { ChangelogEntryItem } from "@/components/changelog-entry-item";
import { getGroupAnchorId } from "@/components/changelog-viewer/utils";
import { IconSquare2StackedLine } from "@karrotmarket/react-monochrome-icon";
import type { GroupedChangelogEntry, ResolvedRelatedPackage } from "@/lib/changelog-data";
import { Snackbar, useSnackbarAdapter } from "seed-design/ui/snackbar";

function ChangelogGroupHeader({
  group,
  groupQueryHref,
  absoluteGroupHref,
  onCopyLink,
}: {
  group: GroupedChangelogEntry;
  groupQueryHref: string;
  absoluteGroupHref: string;
  onCopyLink: (url: string) => void;
}) {
  return (
    <div
      className={[
        "flex items-center justify-between gap-2 flex-wrap border-b border-fd-border px-4 h-10 bg-fd-card/95 backdrop-blur supports-[backdrop-filter]:bg-fd-card/80",
        "rounded-t-xl",
      ].join(" ")}
    >
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
            onCopyLink(absoluteGroupHref);
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
  );
}

function RelatedPackageEntries({
  title,
  packages,
}: {
  title: string;
  packages: ResolvedRelatedPackage[];
}) {
  if (packages.length === 0) return null;

  return (
    <div className="mt-2 space-y-2">
      <p className="text-xs text-fd-muted-foreground">{title}</p>
      <div className="space-y-2">
        {packages.map((pkg) => (
          <div
            key={`${pkg.name}@${pkg.version}`}
            className="rounded-lg border border-fd-border/80 bg-fd-card/40 px-3 py-2"
          >
            <a
              href={`/react/updates/changelog?tab=${encodeURIComponent(pkg.name)}&from=${encodeURIComponent(pkg.version)}`}
              className="inline-flex items-center rounded-md border border-fd-border px-2 py-0.5 text-[11px] font-mono text-fd-muted-foreground hover:text-fd-foreground hover:bg-fd-accent/60 transition-colors"
            >
              {pkg.name}@{pkg.version}
            </a>
            {pkg.resolvedEntries.length > 0 && (
              <div className="mt-2 divide-y divide-fd-border/50">
                {pkg.resolvedEntries.map((resolvedEntry) => (
                  <ChangelogEntryItem
                    key={resolvedEntry.order}
                    entry={resolvedEntry}
                    hidePackages
                    compact
                  />
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

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
            data-changelog-group-key={groupKey}
            className="rounded-xl border border-fd-border scroll-mt-24 overflow-clip"
          >
            <ChangelogGroupHeader
              group={group}
              groupQueryHref={groupQueryHref}
              absoluteGroupHref={absoluteGroupHref}
              onCopyLink={(url) => {
                void copyDeepLink(url);
              }}
            />
            <div className="px-3 py-1">
              <ul className="list-disc pl-5 pr-1 marker:text-fd-muted-foreground">
                {group.entries.map((entry, index) => {
                  const { resolvedRelatedPackages } = entry;

                  if (entry.isDependencyOnly) {
                    return (
                      <li key={`${group.packageName}@${group.version}-${entry.order}-${index}`}>
                        <span className="text-xs text-fd-muted-foreground">
                          하위 패키지 업데이트에 의한 버전 변경
                        </span>
                        <RelatedPackageEntries
                          title={`함께 업데이트된 패키지 ${resolvedRelatedPackages.length}개`}
                          packages={resolvedRelatedPackages}
                        />
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
                      <RelatedPackageEntries
                        title={`이 변경으로 함께 업데이트된 패키지 ${resolvedRelatedPackages.length}개`}
                        packages={resolvedRelatedPackages}
                      />
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
