import path from "path";
import type { z } from "zod";
import {
  type ComponentMetadataWithRegistrySchema,
  type componentMetadataSchemaWithRegistry,
  componentMetadataIndexSchema,
} from "@/src/schema";
import type { Config } from "@/src/utils/get-config";

const BASE_URL =
  process.env.NODE_ENV === "prod" ? "https://component-seed.design.io" : "http://localhost:3000";

export async function fetchComponentMetadatas(
  fileNames?: string[],
): Promise<ComponentMetadataWithRegistrySchema[]> {
  try {
    const results = await Promise.all(
      fileNames.map(async (fileName) => {
        const response = await fetch(`${BASE_URL}/registry/components/${fileName}.json`);
        return await response.json();
      }),
    );

    return results;
  } catch (error) {
    console.log(error);
    throw new Error(`Failed to fetch registry from ${BASE_URL}.`);
  }
}

export async function getMetadataIndex() {
  try {
    const [result] = await fetchComponentMetadatas(["index"]);

    return componentMetadataIndexSchema.parse(result);
  } catch (error) {
    throw new Error("Failed to fetch components from registry.");
  }
}

export async function getItemTargetPath(
  config: Config,
  item: Pick<z.infer<typeof componentMetadataSchemaWithRegistry>, "type">,
  override?: string,
) {
  if (override) {
    return override;
  }

  // if (config.aliases.ui) {
  //   return config.resolvedPaths.ui;
  // }

  const [parent, type] = item.type.split(":");
  if (!(parent in config.resolvedPaths)) {
    return null;
  }

  return path.join(config.resolvedPaths[parent as keyof typeof config.resolvedPaths], type);
}
