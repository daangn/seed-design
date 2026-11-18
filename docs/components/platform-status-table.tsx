/**
 * 컴포넌트 문서 머리의 플랫폼 구현 상태(정적 React). Done(`ready`)인 플랫폼만 인라인으로 보여준다.
 * render 중 Sanity를 조회하지 않고 `prepare:sanity-snapshot`이 만든 스냅숏을 module로 읽는다(`lib/component-status.ts`).
 */
import { IconCheckmarkCircleFill } from "@karrotmarket/react-monochrome-icon";
import { Icon } from "@seed-design/react";
import { Fragment } from "react";
import { IconSeedArrow } from "@/components/icon-seed-arrow";
import { componentStatus } from "@/lib/component-status";
import { PLATFORM_CONFIG } from "@/lib/platform-status";
import { isExternalUrl } from "@/lib/url";

interface PlatformStatusRow {
  name: string;
  platforms: Array<{ key: string; label: string; url?: string }>;
}

function PlatformItem({ label, href }: { label: string; href?: string }) {
  const content = (
    <>
      <Icon svg={<IconCheckmarkCircleFill />} color="fg.positive" size="x5" />
      <span className="font-medium text-fg-neutral">{label}</span>
      {href && <IconSeedArrow className="size-x4 text-fg-neutral-subtle" />}
    </>
  );
  const className = "inline-flex items-center gap-1";
  if (!href) return <span className={className}>{content}</span>;
  if (isExternalUrl(href)) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={`${className} hover:underline`}
      >
        {content}
      </a>
    );
  }
  return (
    <a href={href} className={`${className} hover:underline`}>
      {content}
    </a>
  );
}

interface PlatformStatusTableProps {
  /** 상태를 보여줄 컴포넌트 id 목록. 2개 이상이면 각 행 앞에 컴포넌트 이름 라벨을 붙인다. */
  componentIds: string[];
  /** 페이지 헤더(설명 아래)에서 렌더할 때 true. 설명의 mb-8을 상쇄해 간격을 flex gap(16px)과 같게 맞춘다. */
  inHeader?: boolean;
}

export function PlatformStatusTable({ componentIds, inHeader = false }: PlatformStatusTableProps) {
  const rows: PlatformStatusRow[] = componentIds.flatMap((id) => {
    const component = componentStatus(id);
    if (!component) return [];
    const platforms = PLATFORM_CONFIG.filter(
      ({ key }) => component.platforms[key].status === "ready",
    ).map(({ key, label }) => ({ key, label, url: component.platforms[key].url }));
    return platforms.length > 0 ? [{ name: component.name, platforms }] : [];
  });
  const showLabel = componentIds.length > 1;
  if (rows.length === 0) return null;
  const margin = inHeader ? "-mt-8 mb-3" : "my-3";

  // 단일 컴포넌트: 제목(h1)이 이미 이름이라 라벨 없이 한 줄.
  if (!showLabel) {
    return (
      <div className={`not-prose flex flex-wrap items-center gap-x-4 gap-y-2 ${margin}`}>
        {rows[0]?.platforms.map((platform) => (
          <PlatformItem key={platform.key} label={platform.label} href={platform.url} />
        ))}
      </div>
    );
  }

  // 서브컴포넌트 여럿: [이름 | 플랫폼] 2열 그리드로 이름을 세로 정렬.
  return (
    <div className={`not-prose grid grid-cols-[auto_1fr] items-center gap-x-5 gap-y-2 ${margin}`}>
      {rows.map((row) => (
        <Fragment key={row.name}>
          <span className="font-semibold text-fg-neutral">{row.name}</span>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
            {row.platforms.map((platform) => (
              <PlatformItem key={platform.key} label={platform.label} href={platform.url} />
            ))}
          </div>
        </Fragment>
      ))}
    </div>
  );
}
