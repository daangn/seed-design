"use client";

import { PortableContent } from "@/sanity/lib/sanity-content";
import { TableOfContents } from "fumadocs-core/server";
import { DocsBody, DocsDescription, DocsPage, DocsTitle } from "fumadocs-ui/page";
import React from "react";
import { fetchSanityGuide, SanityGuideData } from "./sanity-guide";
import { Guide } from "./types";
import { useSearchParams } from "next/navigation";

export function SanityGuidePreview({
  slug,
  full,
  title,
  description,
  lastModified,
  toc,
  initialSanityData,
  children,
}: {
  slug: string[] | undefined;
  full?: boolean;
  title: string;
  description?: string;
  lastModified?: Date;
  toc: TableOfContents;
  initialSanityData?: SanityGuideData;
  children?: React.ReactNode;
}) {
  const searchParams = useSearchParams();
  const isPreview = searchParams.get("preview") === "true";
  const [guideline, setGuideline] = React.useState<Guide | null>(
    initialSanityData?.content ?? null,
  );
  const [combinedToc, setCombinedToc] = React.useState([...(initialSanityData?.toc ?? []), ...toc]);

  React.useEffect(() => {
    if (!isPreview) return;

    const guidelinePromise = fetchSanityGuide(slug, { perspective: "drafts" });
    guidelinePromise.then((data) => {
      if (data.content) {
        setGuideline(data.content);
        setCombinedToc([...data.toc, ...toc]);
      }
    });
  }, [isPreview, slug, toc]);

  return (
    <DocsPage toc={combinedToc} full={full} lastUpdate={lastModified}>
      <DocsTitle>{title}</DocsTitle>
      <DocsDescription>{description}</DocsDescription>
      <DocsBody>
        {guideline && <PortableContent content={guideline.content} />}
        {children}
      </DocsBody>
    </DocsPage>
  );
}
