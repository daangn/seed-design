import type { PublicRegistry } from "@/src/schema";

import * as p from "@clack/prompts";
import {
  type PublicRegistryItem,
  publicRegistrySchema,
  publicRegistryItemSchema,
  type PublicAvailableRegistries,
  publicAvailableRegistriesSchema,
  type DocsIndex,
  docsIndexSchema,
} from "@/src/schema";
import { CliError } from "@/src/utils/error";

const FETCH_TIMEOUT_MS = 10_000;

async function fetchWithTimeout(url: string, timeoutMs = FETCH_TIMEOUT_MS): Promise<Response> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { signal: controller.signal });
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      throw new CliError({
        message: `요청 시간이 초과되었어요 (${timeoutMs}ms): ${url}`,
        hint: "네트워크 상태를 확인하고 다시 시도해주세요.",
      });
    }
    throw error;
  } finally {
    clearTimeout(timeout);
  }
}

export async function fetchDocsIndex({ baseUrl }: { baseUrl: string }): Promise<DocsIndex> {
  const response = await fetch(`${baseUrl}/__docs__/index.json`);

  if (!response.ok)
    throw new CliError({
      message: `문서 목록을 가져오지 못했어요: ${response.status} ${response.statusText}`,
    });

  const data = await response.json();
  const { success, data: parsed, error } = docsIndexSchema.safeParse(data);

  if (!success)
    throw new CliError({
      message: `문서 목록 파싱에 실패했어요: ${error?.message}`,
    });

  return parsed;
}

export async function fetchAvailableRegistries({
  baseUrl,
}: {
  baseUrl: string;
}): Promise<PublicAvailableRegistries> {
  // TODO: make this file public
  const response = await fetch(`${baseUrl}/__registry__/index.json`);

  if (!response.ok)
    throw new Error(`Failed to fetch registries: ${response.status} ${response.statusText}`);

  const registries = await response.json();
  const {
    success,
    data: parsedRegistries,
    error,
  } = publicAvailableRegistriesSchema.safeParse(registries);

  if (!success) throw new Error(`Failed to parse registries: ${error?.message}`);

  return parsedRegistries;
}

export async function fetchRegistry({
  baseUrl,
  registryId,
}: {
  baseUrl: string;
  registryId: PublicRegistry["id"];
}): Promise<PublicRegistry> {
  const response = await fetch(`${baseUrl}/__registry__/${registryId}/index.json`);

  if (!response.ok)
    throw new Error(
      `Failed to fetch ${registryId} registry: ${response.status} ${response.statusText}`,
    );

  const index = await response.json();
  const { success, data: parsedIndex, error } = publicRegistrySchema.safeParse(index);

  if (!success) throw new Error(`Failed to parse ${registryId} registry: ${error?.message}`);

  return parsedIndex;
}

async function fetchRegistryItem({
  baseUrl,
  registryId,
  registryItemId,
}: {
  baseUrl: string;
  registryId: PublicRegistry["id"];
  registryItemId: PublicRegistryItem["id"];
}): Promise<PublicRegistryItem> {
  const response = await fetch(`${baseUrl}/__registry__/${registryId}/${registryItemId}.json`);

  if (!response.ok) {
    throw new Error(`Failed to fetch ${registryItemId}: ${response.status} ${response.statusText}`);
  }

  const item = await response.json();
  const { success, data: parsedItem, error } = publicRegistryItemSchema.safeParse(item);

  if (!success) {
    throw new Error(`Failed to parse ${registryItemId}: ${error?.message}`);
  }

  return parsedItem;
}

export async function fetchLlmsTxt({ url }: { url: string }): Promise<string> {
  const response = await fetchWithTimeout(url);

  if (!response.ok) {
    throw new CliError({
      message: `llms.txt를 가져오지 못했어요: ${response.status} ${response.statusText}`,
      hint: `${url} 에 접근할 수 있는지 확인해주세요.`,
    });
  }

  return response.text();
}

/**
 * Try fetching llms.txt content with fallback URL patterns.
 * 1. {baseUrl}/llms/{query}.txt
 * 2. {baseUrl}/llms/{query}/llms.txt (for package changelog index)
 */
export async function tryFetchLlmsTxt({
  baseUrl,
  query,
}: {
  baseUrl: string;
  query: string;
}): Promise<string> {
  const normalizedQuery = query.startsWith("/") ? query.slice(1) : query;

  const urls = [
    `${baseUrl}/llms/${normalizedQuery}.txt`,
    `${baseUrl}/llms/${normalizedQuery}/llms.txt`,
  ];

  for (const url of urls) {
    const response = await fetchWithTimeout(url).catch(() => null);
    if (response?.ok) {
      return response.text();
    }
  }

  throw new CliError({
    message: `llms.txt를 찾을 수 없어요: ${normalizedQuery}`,
    hint: `다음 경로를 시도했어요:\n${urls.map((u) => `  - ${u}`).join("\n")}`,
  });
}

export async function fetchRegistryItems({
  baseUrl,
  registryId,
  registryItemIds,
}: {
  baseUrl: string;
  registryId: PublicRegistry["id"];
  registryItemIds: PublicRegistryItem["id"][];
}): Promise<PublicRegistryItem[]> {
  return await Promise.all(
    registryItemIds.map(async (itemId) => {
      try {
        return await fetchRegistryItem({ baseUrl, registryId, registryItemId: itemId });
      } catch (error) {
        // show available registry items in the registry
        const response = await fetch(`${baseUrl}/__registry__/${registryId}/index.json`);

        if (!response.ok)
          throw new Error(
            `${registryId} 레지스트리를 가져오지 못했어요: ${response.status} ${response.statusText}`,
          );

        const index = await response.json();
        const { success, data: parsedIndex } = publicRegistrySchema.safeParse(index);

        // fatal, should not happen
        if (!success) throw new Error(`Failed to parse registry index for ${registryId}`);

        p.log.error(`${itemId} 스니펫이 ${registryId} 레지스트리에 없어요.`);
        p.log.info(
          `${registryId} 레지스트리에 존재하는 스니펫:\n${parsedIndex.items
            .map((component) => component.id)
            .join("\n")}`,
        );

        // so fetchRegistryItems also can throw
        throw error;
      }
    }),
  );
}
