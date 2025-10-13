import type { PublicRegistry } from "@/src/schema";

import * as p from "@clack/prompts";
import {
  type PublicRegistryItem,
  publicRegistrySchema,
  publicRegistryItemSchema,
  type PublicAvailableRegistries,
  publicAvailableRegistriesSchema,
} from "@/src/schema";

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
