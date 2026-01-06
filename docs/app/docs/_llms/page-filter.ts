import type { Page } from "fumadocs-core/source";

export function shouldGenerateComponentLLMText({ slugs }: Page) {
  const [firstSlug, secondSlug] = slugs;

  // include components/**
  if (firstSlug === "components") {
    // exclude components/deprecated
    if (secondSlug === "deprecated") return false;
    return true;
  }

  return false;
}

export function shouldGenerateFoundationLLMText({ slugs }: Page) {
  const [firstSlug] = slugs;

  // include foundation/**
  return firstSlug === "foundation";
}
