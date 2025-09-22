import type { PublicRegistry, PublicRegistryItem } from "@/src/schema";

export function resolveDependencies({
  selectedItemKeys,
  publicRegistries,
}: {
  /**
   * @example ["breeze:animate-number", "ui:action-button"]
   */
  selectedItemKeys: string[];
  publicRegistries: PublicRegistry[];
}) {
  const registryItemsToAdd: { registryId: string; items: PublicRegistry["items"] }[] = [];
  const npmDependenciesToAdd = new Set<string>();

  function collectRegistryItemsToAdd(registryId: string, item: PublicRegistryItem) {
    const registryFoundToAdd = registryItemsToAdd.find((r) => r.registryId === registryId);

    // if already added, skip
    if (registryFoundToAdd?.items.some((i) => i.id === item.id)) return;

    // Add the item to the list
    if (registryFoundToAdd) {
      registryFoundToAdd.items.push(item);
    } else {
      registryItemsToAdd.push({ registryId, items: [item] });
    }

    // process dependencies
    if (item.dependencies?.length) {
      for (const dep of item.dependencies) {
        npmDependenciesToAdd.add(dep);
      }
    }

    // process innerDependencies
    if (item.innerDependencies?.length) {
      for (const dependency of item.innerDependencies) {
        for (const depItemId of dependency.itemIds) {
          const depItem = publicRegistries
            .find((r) => r.id === dependency.registryId)
            ?.items.find((i) => i.id === depItemId);

          // should not happen
          if (!depItem)
            throw new Error(`Cannot find dependency item: ${dependency.registryId}:${depItemId}`);

          collectRegistryItemsToAdd(dependency.registryId, depItem);
        }
      }
    }
  }

  for (const item of selectedItemKeys) {
    const [registryId, ...rest] = item.split(":");
    const itemId = rest.join(":");

    if (!registryId || !itemId) {
      throw new Error(`Invalid snippet format: "${item}"`);
    }

    const foundItem = publicRegistries
      .find((r) => r.id === registryId)
      ?.items.find((i) => i.id === itemId);

    if (!foundItem) {
      throw new Error(`Cannot find snippet: "${item}"`);
    }

    collectRegistryItemsToAdd(registryId, foundItem);
  }

  return {
    registryItemsToAdd,
    npmDependenciesToAdd,
  };
}
