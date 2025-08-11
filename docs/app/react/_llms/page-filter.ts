import type { Page } from "fumadocs-core/source";

export function shouldGenerateLLMFriendlyText({ slugs }: Page) {
  const [firstSlug, secondSlug] = slugs;

  // include components/**
  if (firstSlug !== "components") return false;

  // exclude components/concepts
  if (secondSlug === "concepts") return false;

  return true;
}
