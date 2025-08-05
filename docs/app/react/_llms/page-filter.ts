import type { Page } from "fumadocs-core/source";

export function shouldGenerateLLMFriendlyText({ slugs }: Page) {
  const [firstSlug, secondSlug] = slugs;

  // include components/** but exclude components/concepts
  if (firstSlug !== "components" || (firstSlug === "components" && secondSlug === "concepts")) {
    return false;
  }

  return true;
}
