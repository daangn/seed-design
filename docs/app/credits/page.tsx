import {
  CREDITS_DESCRIPTION,
  CREDITS_GROUPS,
  CREDITS_TITLE,
  type Contributor,
  type CreditsGroup,
} from "@/components/layout/lib/credits-content";
import { ProsePage } from "@/components/layout/prose-page";
import { buildSeoMetadata } from "@/lib/seo";
import type { Metadata } from "next";

export const dynamic = "force-static";

/**
 * 기여자 크레딧 페이지. 사이드바·ToC 없는 중앙 1컬럼(ProsePage)이다.
 * 두 그룹은 같은 타이포 스케일로 렌더한다 — 한쪽을 흐리게 두면 "덜 중요"로
 * 읽히므로, 구분은 그룹 제목으로만 한다.
 */
export default function CreditsPage() {
  return (
    <ProsePage title={CREDITS_TITLE} description={CREDITS_DESCRIPTION} fullHeight>
      <div className="not-prose flex flex-col gap-14 md:gap-20">
        {CREDITS_GROUPS.map((group) => (
          <ContributorGroup key={group.title} group={group} />
        ))}
      </div>
    </ProsePage>
  );
}

function ContributorGroup({ group }: { group: CreditsGroup }) {
  return (
    <section>
      <h2 className="text-fd-muted-foreground text-base font-extralight">{group.title}</h2>
      <ul className="mt-6 flex flex-wrap gap-x-10 gap-y-5">
        {group.contributors.map((contributor) => (
          <li key={contributor.name}>
            <ContributorItem contributor={contributor} />
          </li>
        ))}
      </ul>
    </section>
  );
}

function ContributorItem({ contributor }: { contributor: Contributor }) {
  const { name, koreanName, link } = contributor;

  const body = (
    <>
      <span className="text-fd-foreground text-xl font-medium tracking-tight md:text-2xl">
        {name}
      </span>
      {koreanName ? (
        <span className="text-fd-muted-foreground ml-2 text-xs font-light">{koreanName}</span>
      ) : null}
    </>
  );

  if (link) {
    return (
      <a
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        className="hover:text-fd-muted-foreground transition-colors"
      >
        {body}
      </a>
    );
  }

  return <div>{body}</div>;
}

export function generateMetadata(): Metadata {
  return buildSeoMetadata({
    title: CREDITS_TITLE,
    description: CREDITS_DESCRIPTION,
  });
}
