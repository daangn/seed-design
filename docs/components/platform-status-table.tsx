import { client } from "@/sanity-studio/lib/client";
import { COMPONENT_QUERY } from "@/sanity-studio/lib/queries";
import { ComponentData, PlatformStatus } from "@/sanity-studio/lib/types";
import { PLATFORM_CONFIG } from "@/lib/platform-status";
import { isExternalUrl } from "@/lib/url";
import { IconCheckmarkCircleFill } from "@karrotmarket/react-monochrome-icon";
import { IconSeedArrow } from "@/components/icon-seed-arrow";
import { Icon } from "@seed-design/react";
import Link from "next/link";
import { Fragment } from "react";

interface PlatformStatusTableProps {
  /** 상태를 보여줄 컴포넌트 id 목록. 2개 이상이면 각 행 앞에 컴포넌트 이름 라벨을 붙인다. */
  componentIds: string[];
  /**
   * 페이지 헤더(설명 아래)에서 렌더할 때 true. 부모 article이 flex-col gap-16px라
   * 설명의 mb-8(32px)이 간격에 더해져 title↔설명(16px)보다 넓어진다. `-mt-8`로 그 mb-8을
   * 상쇄해 간격을 flex gap(16px)과 같게 맞춘다.
   */
  inHeader?: boolean;
}

/** 컴포넌트에서 Done(`ready`)인 플랫폼만 뽑아 {label, url}로 반환. */
function donePlatforms(component: ComponentData) {
  return PLATFORM_CONFIG.filter(
    ({ key }) => (component[`${key}Status` as keyof ComponentData] as PlatformStatus) === "ready",
  ).map(({ key, label }) => ({
    key,
    label,
    url: component[`${key}Url` as keyof ComponentData] as string | undefined,
  }));
}

/**
 * Done 플랫폼 한 칸: 초록 체크 + 이름 (+ 링크가 있으면 오른쪽 화살표).
 * 링크는 내부/외부 동작만 구분(외부는 새 탭)하고 아이콘은 → 로 통일한다.
 */
function PlatformItem({ label, href }: { label: string; href?: string }) {
  const content = (
    <>
      <Icon svg={<IconCheckmarkCircleFill />} color="fg.positive" size="x5" />
      <span className="font-medium text-fg-neutral">{label}</span>
      {href && <IconSeedArrow className="size-x4 text-fg-neutral-subtle" />}
    </>
  );

  const className = "inline-flex items-center gap-1";

  if (!href) {
    return <span className={className}>{content}</span>;
  }

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
    <Link href={href} className={`${className} hover:underline`}>
      {content}
    </Link>
  );
}

/**
 * 컴포넌트 문서의 플랫폼 구현 상태. 각 컴포넌트의 Done(`ready`) 플랫폼만 인라인으로 보여준다.
 * 단일 컴포넌트는 한 줄(라벨 없음), 서브컴포넌트를 여럿 다루는 페이지는 각 컴포넌트 이름을
 * 라벨로 붙여 한 행씩 보여준다. Done 플랫폼이 하나도 없으면 아무것도 렌더하지 않는다.
 */
export async function PlatformStatusTable({
  componentIds,
  inHeader = false,
}: PlatformStatusTableProps) {
  const components = (
    await Promise.all(
      componentIds.map((id) =>
        client.fetch<ComponentData>(COMPONENT_QUERY, { id }, { cache: "no-store" }),
      ),
    )
  ).filter((c): c is ComponentData => Boolean(c));

  const rows = components
    .map((component) => ({ name: component.name, platforms: donePlatforms(component) }))
    .filter((row) => row.platforms.length > 0);

  if (rows.length === 0) return null;

  const margin = inHeader ? "-mt-8 mb-3" : "my-3";
  const showLabel = componentIds.length > 1;

  // 단일 컴포넌트: 제목(h1)이 이미 이름이라 라벨 없이 한 줄.
  if (!showLabel) {
    return (
      <div className={`not-prose flex flex-wrap items-center gap-x-4 gap-y-2 ${margin}`}>
        {rows[0].platforms.map((platform) => (
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
