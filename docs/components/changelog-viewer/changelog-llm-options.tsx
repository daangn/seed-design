"use client";

import { archivePaths } from "@/lib/docs-archive";
import { getChangelogPlatform, type ChangelogPlatform } from "@/lib/changelog-platform";

import { ALL } from "@/components/changelog-viewer/constants";
import { LLMOptions } from "@/components/page-actions";
import { Suspense } from "react";
import { useQueryState } from "nuqs";

const SCOPE = "@seed-design/";

function toSlug(packageName: string): string {
  return packageName.startsWith(SCOPE) ? packageName.slice(SCOPE.length) : packageName;
}

function getChangelogLlmsUrl(
  pkg: string,
  version: string,
  fallbackUrl: string,
  platform: ChangelogPlatform,
): string {
  if (!pkg || pkg === ALL || getChangelogPlatform(pkg) !== platform) return fallbackUrl;
  const slug = toSlug(pkg);
  const path =
    version === ALL
      ? `/llms/${platform}/updates/changelog/${slug}/llms.txt`
      : `/llms/${platform}/updates/changelog/${slug}/${encodeURIComponent(version)}.txt`;
  if (platform === "lynx" && archivePaths.prefix) return `https://seed-design.io${path}`;
  return archivePaths.endpoint(path);
}

function ChangelogLLMOptionsInner({
  fallbackUrl,
  platform,
}: {
  fallbackUrl: string;
  platform: ChangelogPlatform;
}) {
  const [pkg] = useQueryState("package", { defaultValue: "" });
  const [version] = useQueryState("version", { defaultValue: ALL });

  const markdownUrl = getChangelogLlmsUrl(pkg, version, fallbackUrl, platform);
  return <LLMOptions markdownUrl={markdownUrl} />;
}

export function ChangelogLLMOptions({
  fallbackUrl,
  platform,
}: {
  fallbackUrl: string;
  platform: ChangelogPlatform;
}) {
  return (
    <Suspense fallback={<LLMOptions markdownUrl={fallbackUrl} />}>
      <ChangelogLLMOptionsInner fallbackUrl={fallbackUrl} platform={platform} />
    </Suspense>
  );
}
