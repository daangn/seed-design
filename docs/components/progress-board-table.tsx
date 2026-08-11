import { client } from "@/sanity-studio/lib/client";
import { ALL_COMPONENTS_QUERY } from "@/sanity-studio/lib/queries";
import { ComponentData, PlatformStatus } from "@/sanity-studio/lib/types";
import { HelpBubbleTooltipTrigger } from "seed-design/ui/help-bubble-tooltip";
import { IconSeedArrow } from "@/components/icon-seed-arrow";
import IconILowercaseSerifCircleLine from "@karrotmarket/react-monochrome-icon/IconILowercaseSerifCircleLine";
import { Badge } from "@seed-design/react";
import Link from "next/link";
import type { CSSProperties } from "react";
import { PLATFORM_CONFIG, PLATFORM_STATUS_LABELS } from "@/lib/platform-status";
import { isExternalUrl } from "@/lib/url";
import { TableRoot } from "./table";

const statusConfig: Record<
  PlatformStatus,
  { label: string; tone: "positive" | "warning" | "neutral"; variant: "weak" | "solid" | "outline" }
> = {
  ready: { label: PLATFORM_STATUS_LABELS.ready, tone: "positive", variant: "weak" },
  "in-progress": { label: PLATFORM_STATUS_LABELS["in-progress"], tone: "warning", variant: "weak" },
  "not-ready": { label: PLATFORM_STATUS_LABELS["not-ready"], tone: "neutral", variant: "weak" },
  deprecated: { label: PLATFORM_STATUS_LABELS.deprecated, tone: "neutral", variant: "weak" },
  "not-planned": { label: PLATFORM_STATUS_LABELS["not-planned"], tone: "neutral", variant: "weak" },
};

function StatusBadge({
  status,
  note,
  variant,
  style,
  showNote = true,
}: {
  status: PlatformStatus;
  note?: string;
  variant?: "weak" | "solid" | "outline";
  style?: CSSProperties;
  showNote?: boolean;
}) {
  const {
    label,
    tone,
    variant: variantConfig,
  } = statusConfig?.[status] ?? {
    label: "Not Ready",
    tone: "neutral",
    variant: variant ?? "weak",
  };

  if (!note || !showNote) {
    return (
      <Badge size="large" variant={variantConfig} tone={tone} style={style}>
        {label}
      </Badge>
    );
  }

  return (
    <div className="inline-flex items-center gap-1.5">
      <Badge size="large" variant={variantConfig} tone={tone} style={style}>
        {label}
      </Badge>
      <HelpBubbleTooltipTrigger title={note} placement="top">
        <button
          type="button"
          className="inline-flex items-center text-fd-muted-foreground hover:text-fd-foreground transition-colors"
          aria-label="비고 보기"
        >
          <IconILowercaseSerifCircleLine size={16} />
        </button>
      </HelpBubbleTooltipTrigger>
    </div>
  );
}

export async function ProgressBoardTable() {
  const components = await client.fetch<ComponentData[]>(
    ALL_COMPONENTS_QUERY,
    {},
    { cache: "no-store" },
  );

  if (!components || components.length === 0) {
    return <div>컴포넌트 데이터가 없습니다.</div>;
  }

  return (
    <div className="not-prose my-6">
      {/* Components Table — SEED design via shared TableRoot (single source in ./table) */}
      <TableRoot
        stickyHeader
        className="[&_thead_th:not(:first-child)]:text-center [&_tbody_tr:hover_td:first-child]:bg-bg-neutral-weak"
      >
        <thead>
          <tr>
            {/* 가로·세로 양축 고정이라, 가로 스크롤 시 미끄러져 들어오는 나머지 헤더 셀 위에 있어야 한다.
                배경·z 모두 TableRoot의 `[&_thead_th]:` 규칙보다 명시도가 낮아 !important가 필요하다 */}
            <th className="sticky left-0 z-20! bg-bg-layer-default!">Component</th>
            {PLATFORM_CONFIG.map(({ key, label }) => (
              <th key={key}>{label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {components.map((component) => (
            <tr key={component.id} className="group">
              <td className="sticky left-0 bg-bg-layer-default font-medium transition-colors">
                <Link
                  href={`/components/${component.id}`}
                  className="text-fd-primary hover:underline"
                >
                  {component.name}
                </Link>
              </td>
              {PLATFORM_CONFIG.map(({ key: platform }) => {
                const statusKey = `${platform}Status` as keyof ComponentData;
                const urlKey = `${platform}Url` as keyof ComponentData;
                const noteKey = `${platform}Note` as keyof ComponentData;
                const status = component[statusKey] as PlatformStatus;
                const url = component[urlKey] as string | undefined;
                const note = component[noteKey] as string | undefined;

                return (
                  <td key={platform} className="text-center">
                    {url ? (
                      <div className="inline-flex items-center gap-1.5">
                        {isExternalUrl(url) ? (
                          <a
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            title={status}
                            className="no-underline hover:[&>*]:underline"
                          >
                            <StatusBadge status={status} showNote={false} />
                          </a>
                        ) : (
                          <Link
                            href={url}
                            title={status}
                            className="no-underline hover:[&>*]:underline"
                          >
                            <StatusBadge status={status} showNote={false} />
                          </Link>
                        )}
                        {note && (
                          <HelpBubbleTooltipTrigger title={note} placement="top">
                            <button
                              type="button"
                              className="inline-flex items-center text-fd-muted-foreground hover:text-fd-foreground transition-colors"
                              aria-label="비고 보기"
                            >
                              <IconILowercaseSerifCircleLine size={16} />
                            </button>
                          </HelpBubbleTooltipTrigger>
                        )}
                        <IconSeedArrow className="size-x3 text-fg-neutral opacity-0 transition-opacity group-hover:opacity-100" />
                      </div>
                    ) : (
                      <StatusBadge status={status} note={note} />
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
