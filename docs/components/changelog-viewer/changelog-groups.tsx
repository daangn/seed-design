"use client";

import { ChangelogEntryItem } from "@/components/changelog-entry-item";
import { getChangelogHref, getGroupAnchorId } from "@/components/changelog-viewer/utils";
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
    <header className="mb-x3 flex min-w-0 flex-wrap items-baseline justify-between gap-x3 gap-y-x2">
      <h2 className="group/copy m-0 inline-flex min-w-0 items-center gap-x2">
        <a
          href={groupQueryHref}
          className="min-w-0 truncate font-mono text-[0.9375rem] font-semibold leading-6 text-fg-neutral underline decoration-fd-border underline-offset-4 transition-colors hover:text-fd-primary"
        >
          {group.packageName}@{group.version}
        </a>
        <button
          type="button"
          className="shrink-0 rounded-r1 p-1 text-fg-neutral-muted opacity-0 transition-[opacity,background-color,color] hover:bg-bg-transparent-pressed hover:text-fg-neutral group-hover/copy:opacity-100 focus:opacity-100"
          onClick={() => {
            onCopyLink(absoluteGroupHref);
          }}
          aria-label={`${group.packageName}@${group.version} 링크 복사`}
          title="링크 복사"
        >
          <IconSquare2StackedLine size={14} aria-hidden />
        </button>
      </h2>
      <span className="t3-regular shrink-0 text-fg-neutral-muted">
        {group.entries.length}개 변경사항
      </span>
    </header>
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
    <div className="mt-x3 min-w-0 space-y-x2">
      <p className="t3-regular m-0 text-fg-neutral-muted">{title}</p>
      <div className="min-w-0 space-y-x2 pl-x3">
        {packages.map((pkg) => (
          <div key={`${pkg.name}@${pkg.version}`} className="min-w-0 overflow-hidden">
            <a
              href={getChangelogHref(pkg.name, pkg.version)}
              className="inline-flex max-w-full min-w-0 items-center font-mono text-[11px] text-fg-neutral-muted underline decoration-fd-border underline-offset-4 transition-colors hover:text-fg-neutral"
            >
              <span className="truncate">
                {pkg.name}@{pkg.version}
              </span>
            </a>
            {pkg.resolvedEntries.length > 0 && (
              <div className="mt-x2 min-w-0 space-y-x2">
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
    <div className="flex min-w-0 flex-col gap-x8">
      {groupedEntries.map((group) => {
        const groupAnchorId = getGroupAnchorId(group.packageName, group.version);
        const groupQueryHref = getChangelogHref(group.packageName, group.version);
        const groupKey = `${group.packageName}@${group.version}`;
        const absoluteGroupHref =
          typeof window === "undefined"
            ? groupQueryHref
            : `${window.location.origin}${groupQueryHref}`;

        return (
          <section
            key={groupKey}
            id={groupAnchorId}
            data-changelog-group-key={groupKey}
            className="min-w-0 scroll-mt-28 overflow-hidden"
          >
            <ChangelogGroupHeader
              group={group}
              groupQueryHref={groupQueryHref}
              absoluteGroupHref={absoluteGroupHref}
              onCopyLink={(url) => {
                void copyDeepLink(url);
              }}
            />
            <div className="min-w-0">
              <ul className="m-0 min-w-0 list-disc space-y-x3 pl-x5 pr-x1 marker:text-fg-neutral-muted">
                {group.entries.map((entry, index) => {
                  const { resolvedRelatedPackages } = entry;

                  if (entry.isDependencyOnly) {
                    return (
                      <li
                        key={`${group.packageName}@${group.version}-${entry.order}-${index}`}
                        className="min-w-0"
                      >
                        <span className="t3-regular text-fg-neutral-muted">
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
                    <li
                      key={`${group.packageName}@${group.version}-${entry.order}-${index}`}
                      className="min-w-0"
                    >
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
        <div className="min-w-0 text-sm text-fg-neutral-muted">
          조건에 맞는 변경사항이 없습니다.
        </div>
      )}
    </div>
  );
}
