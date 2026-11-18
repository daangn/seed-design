/**
 * `<ProgressBoardTable />`. 비고 tooltip(`HelpBubbleTooltipTrigger`)이 동작해야 해서 React island다
 * (`src/mdx/islands/ProgressBoardTable.astro`). 스냅숏(`lib/component-status.ts`)은 그 `.astro`가 읽어 props로 넘긴다.
 * 이 파일은 스냅숏 module을 import하지 않는다(브라우저 번들에 싣지 않게).
 */
import IconILowercaseSerifCircleLine from "@karrotmarket/react-monochrome-icon/IconILowercaseSerifCircleLine";
import { BadgeLabel, BadgeRoot } from "@seed-design/react";
import { HelpBubbleTooltipTrigger } from "seed-design/ui/help-bubble-tooltip";
import { IconSeedArrow } from "@/components/icon-seed-arrow";
import { TableRoot } from "@/components/table";
import type { ComponentStatus } from "@/lib/component-status";
import { PLATFORM_CONFIG, PLATFORM_STATUS_LABELS } from "@/lib/platform-status";
import { isExternalUrl } from "@/lib/url";
import type { PlatformStatus } from "@/sanity-studio/lib/types";

const statusConfig: Record<PlatformStatus, { tone: "positive" | "warning" | "neutral" }> = {
  ready: { tone: "positive" },
  "in-progress": { tone: "warning" },
  "not-ready": { tone: "neutral" },
  deprecated: { tone: "neutral" },
  "not-planned": { tone: "neutral" },
};

function NoteButton({ note }: { note: string }) {
  return (
    <HelpBubbleTooltipTrigger title={note} placement="top">
      <button
        type="button"
        className="inline-flex items-center text-fd-muted-foreground hover:text-fd-foreground transition-colors"
        aria-label="비고 보기"
      >
        <IconILowercaseSerifCircleLine size={16} />
      </button>
    </HelpBubbleTooltipTrigger>
  );
}

function StatusBadge({ status }: { status: PlatformStatus }) {
  const tone = statusConfig[status]?.tone ?? "neutral";
  return (
    <BadgeRoot size="large" variant="weak" tone={tone}>
      <BadgeLabel>{PLATFORM_STATUS_LABELS[status] ?? "Not Ready"}</BadgeLabel>
    </BadgeRoot>
  );
}

function LinkTo({
  href,
  className,
  title,
  children,
}: {
  href: string;
  className: string;
  title?: string;
  children: React.ReactNode;
}) {
  return isExternalUrl(href) ? (
    <a href={href} target="_blank" rel="noopener noreferrer" title={title} className={className}>
      {children}
    </a>
  ) : (
    <a href={href} title={title} className={className}>
      {children}
    </a>
  );
}

export function ProgressBoardTable({ components }: { components: ComponentStatus[] }) {
  if (components.length === 0) return <div>컴포넌트 데이터가 없습니다.</div>;

  return (
    <div className="not-prose my-6">
      <TableRoot className="[&_thead_th:not(:first-child)]:text-center [&_tbody_tr:hover_td:first-child]:bg-bg-neutral-weak">
        <thead>
          <tr>
            {/* sticky 좌상단 헤더 셀만 TableRoot의 [&_th]:bg-transparent를 이겨 불투명 유지 */}
            <th className="sticky left-0 bg-bg-layer-default!">Component</th>
            {PLATFORM_CONFIG.map(({ key, label }) => (
              <th key={key}>{label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {components.map((component) => (
            <tr key={component.id} className="group">
              <td className="sticky left-0 bg-bg-layer-default font-medium transition-colors">
                {component.url ? (
                  <LinkTo href={component.url} className="text-fd-primary hover:underline">
                    {component.name}
                  </LinkTo>
                ) : (
                  component.name
                )}
              </td>
              {PLATFORM_CONFIG.map(({ key }) => {
                const { status, url, note } = component.platforms[key];
                return (
                  <td key={key} className="text-center">
                    {url ? (
                      <div className="inline-flex items-center gap-1.5">
                        <LinkTo
                          href={url}
                          title={status}
                          className="no-underline hover:[&>*]:underline"
                        >
                          <StatusBadge status={status} />
                        </LinkTo>
                        {note && <NoteButton note={note} />}
                        <IconSeedArrow className="size-x3 text-fg-neutral opacity-0 transition-opacity group-hover:opacity-100" />
                      </div>
                    ) : note ? (
                      <div className="inline-flex items-center gap-1.5">
                        <StatusBadge status={status} />
                        <NoteButton note={note} />
                      </div>
                    ) : (
                      <StatusBadge status={status} />
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </TableRoot>
    </div>
  );
}
