import {
  componentMetadataIndexSchema,
  type ComponentMetadataWithRegistrySchema,
} from "@/src/schema";

const BASE_URL =
  process.env.NODE_ENV === "prod" ? "https://component-seed.design.io" : "http://localhost:3000";

export async function fetchComponentMetadatas(
  fileNames?: string[],
): Promise<ComponentMetadataWithRegistrySchema[]> {
  try {
    const results = await Promise.all(
      fileNames.map(async (fileName) => {
        const response = await fetch(`${BASE_URL}/registry/component/${fileName}.json`);
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
    console.log(error);
    throw new Error(`Failed to fetch components from ${BASE_URL}.`);
  }
}
