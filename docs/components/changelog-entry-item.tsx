import type { ChangelogEntry } from "@/lib/parse-changelog";
import { SeedClientCodeBlock } from "@/components/codeblock/client-code-block";

const PROSE_CLASS =
  "prose prose-sm dark:prose-invert max-w-none min-w-0 break-words prose-p:my-0 prose-li:my-0.5 prose-a:text-fd-primary prose-code:text-fd-primary prose-code:bg-fd-muted prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:text-xs [&>*:last-child]:mb-0 [&_a]:break-words [&_code]:break-words";

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
    <div className={`${compact ? "py-0.5" : "py-6 first:pt-0"} flex min-w-0 flex-col gap-2`}>
      {entry.contentBlocks.map((block, i) => {
        if (block.type === "code") {
          return (
            <SeedClientCodeBlock
              // biome-ignore lint/suspicious/noArrayIndexKey: parsed content blocks are stable within a changelog entry
              key={i}
              lang={block.lang}
              code={block.code}
              className="!my-0 min-w-0 max-w-full"
            />
          );
        }
        return (
          <div
            // biome-ignore lint/suspicious/noArrayIndexKey: parsed content blocks are stable within a changelog entry
            key={i}
            className={PROSE_CLASS}
            // biome-ignore lint/security/noDangerouslySetInnerHtml: changelog markdown is sanitized server-side before rendering
            dangerouslySetInnerHTML={{ __html: block.html }}
          />
        );
      })}

      {(!hidePackages || showPackage) && (
        <div className="flex min-w-0 flex-wrap gap-1.5">
          <a
            href={entry.package.url}
            target="_blank"
            rel="noreferrer noopener"
            className="inline-flex max-w-full min-w-0 items-center gap-1.5 rounded-r1 bg-bg-transparent-selected px-x2 py-0.5 font-mono text-xs text-fg-neutral transition-colors hover:bg-bg-transparent-pressed"
          >
            <span className="min-w-0 truncate">{entry.package.name}</span>
            <span className="text-fg-neutral-muted">@</span>
            <span className="font-semibold">{entry.package.version}</span>
          </a>
        </div>
      )}
    </div>
  );
}
