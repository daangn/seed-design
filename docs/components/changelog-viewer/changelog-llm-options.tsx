"use client";

import { ALL } from "@/components/changelog-viewer/constants";
import { LLMOptions } from "@/components/page-actions";
import { Suspense } from "react";
import { useQueryState } from "nuqs";

function getChangelogLlmsUrl(pkg: string, version: string, fallbackUrl: string): string {
  if (!pkg || pkg === ALL) return fallbackUrl;
  if (version === ALL) return `/llms/react/updates/changelog/${pkg}/llms.txt`;
  return `/llms/react/updates/changelog/${pkg}/${version}.txt`;
}

function ChangelogLLMOptionsInner({ fallbackUrl }: { fallbackUrl: string }) {
  const [pkg] = useQueryState("package", { defaultValue: "" });
  const [version] = useQueryState("version", { defaultValue: ALL });

  const markdownUrl = getChangelogLlmsUrl(pkg, version, fallbackUrl);
  return <LLMOptions markdownUrl={markdownUrl} />;
}

export function ChangelogLLMOptions({ fallbackUrl }: { fallbackUrl: string }) {
  return (
    <Suspense fallback={<LLMOptions markdownUrl={fallbackUrl} />}>
      <ChangelogLLMOptionsInner fallbackUrl={fallbackUrl} />
    </Suspense>
  );
}
