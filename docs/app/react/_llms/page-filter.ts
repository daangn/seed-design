import type { Page } from "fumadocs-core/source";

export function shouldGenerateLLMFriendlyText({ slugs }: Page) {
  const [firstSlug, secondSlug] = slugs;

  // include components/**
  if (firstSlug === "components") {
    // exclude components/concepts
    if (secondSlug === "concepts") return false;
    return true;
  }

  // include bits/**
  if (firstSlug === "bits") {
    return true;
  }

  return false;
}
