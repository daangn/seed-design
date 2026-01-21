import { client } from "@/sanity-studio/lib/client";
import { COMPONENT_QUERY } from "@/sanity-studio/lib/queries";
import { ComponentData } from "@/sanity-studio/lib/types";

export async function getComponentStatus(
  params: { slug?: string[] },
  pageData?: { deprecated?: string },
) {
  if (pageData?.deprecated) {
    return {
      deprecated: true,
      deprecatedMessage: pageData.deprecated,
    };
  }

  const componentId = params.slug?.[1];
  if (componentId && params.slug?.[0] === "components") {
    const component = await client.fetch<ComponentData>(COMPONENT_QUERY, { id: componentId });
    if (component?.deprecated) {
      return {
        deprecated: true,
        deprecatedMessage: component.deprecatedMessage || null,
      };
    }
  }

  return { deprecated: false, deprecatedMessage: null };
}

export async function getComponentMetadata(componentId: string) {
  const component = await client.fetch<ComponentData>(COMPONENT_QUERY, { id: componentId });

  if (!component) return null;

  return {
    deprecated: Boolean(component.deprecated),
    deprecatedMessage: component.deprecatedMessage || null,
  };
}
