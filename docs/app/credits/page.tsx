import {
  CREDITS_DESCRIPTION,
  CREDITS_GROUPS,
  CREDITS_TITLE,
  SECRET_THANKS_LABEL,
  SECRET_THANKS_NAMES,
  type Contributor,
  type CreditsGroup,
} from "@/components/layout/lib/credits-content";
import { ProsePage } from "@/components/layout/prose-page";
import { buildSeoMetadata } from "@/lib/seo";
import type { Metadata } from "next";

export const dynamic = "force-static";

export default function CreditsPage() {
  return (
    <ProsePage title={CREDITS_TITLE} description={CREDITS_DESCRIPTION} fullHeight>
      <div className="not-prose flex flex-col gap-14 md:gap-20">
        {CREDITS_GROUPS.map((group) => (
          <ContributorGroup key={group.title} group={group} />
        ))}
        <SecretThanks />
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
  const { name, koreanName } = contributor;

  return (
    <div>
      <span className="text-fd-foreground text-xl font-medium tracking-tight md:text-2xl">
        {name}
      </span>
      {koreanName ? (
        <span className="text-fd-muted-foreground ml-2 text-xs font-light">{koreanName}</span>
      ) : null}
    </div>
  );
}

function SecretThanks() {
  return (
    <section className="text-transparent selection:text-[var(--selection-fg)]">
      <p className="text-base font-extralight">{SECRET_THANKS_LABEL}</p>
      <p className="mt-6 text-xl font-medium tracking-tight md:text-2xl">
        {atob(SECRET_THANKS_NAMES)}
      </p>
    </section>
  );
}

export function generateMetadata(): Metadata {
  return buildSeoMetadata({
    title: CREDITS_TITLE,
    description: CREDITS_DESCRIPTION,
  });
}
