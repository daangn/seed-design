import type { ChangelogEntry } from "@/lib/parse-changelog";

export function ChangelogEntryItem({
  entry,
  hidePackages = false,
  compact = false,
  showPackage = false,
}: {
  entry: ChangelogEntry;
  hidePackages?: boolean;
  compact?: boolean;
  showPackage?: boolean;
}) {
  return (
    <div className={`${compact ? "py-0.5" : "py-6 first:pt-0"} flex flex-col gap-2`}>
      {entry.contentHtml && (
        <div
          className="prose prose-sm dark:prose-invert max-w-none prose-p:my-0 prose-li:my-0.5 prose-a:text-fd-primary prose-code:text-fd-primary prose-code:bg-fd-muted prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:text-xs [&>*:last-child]:mb-0"
          // biome-ignore lint/security/noDangerouslySetInnerHtml: server-side parsed markdown
          dangerouslySetInnerHTML={{ __html: entry.contentHtml }}
        />
      )}

      {(!hidePackages || showPackage) && (
        <div className="flex flex-wrap gap-1.5">
          <a
            href={entry.package.url}
            target="_blank"
            rel="noreferrer noopener"
            className="inline-flex items-center gap-1.5 text-sm px-2.5 py-1 rounded-md border border-fd-border bg-fd-card text-fd-foreground hover:bg-fd-accent transition-colors font-mono"
          >
            <span className="text-fd-muted-foreground">📦</span>
            <span>{entry.package.name}</span>
            <span className="text-fd-muted-foreground">@</span>
            <span className="font-semibold">{entry.package.version}</span>
          </a>
        </div>
      )}
    </div>
  );
}
