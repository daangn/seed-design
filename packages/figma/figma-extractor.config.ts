import { createConfig, createPipeline, sources, writers } from "@seed-design/figma-extractor";
import type { ComponentNode, ComponentSetNode } from "@figma/rest-api-spec";

function removeDefaultValueTransform(
  component: ComponentNode | ComponentSetNode,
): Record<string, unknown> & { name: string } {
  const { componentPropertyDefinitions, ...rest } = component;

  return {
    ...rest,
    ...(componentPropertyDefinitions && {
      componentPropertyDefinitions: Object.fromEntries(
        // take all properties except defaultValue
        Object.entries(componentPropertyDefinitions).map(([key, { defaultValue, ...rest }]) => [
          key,
          rest,
        ]),
      ),
    }),
  };
}

const config = createConfig({
  pipelines: {
    components: createPipeline()
      .source(sources.components)
      .filter(
        ({ name, componentSetId }) =>
          (name.startsWith("🔵 ") || name.startsWith("🟢 ")) && componentSetId === undefined,
      )
      .sort((a, b) => a.name.localeCompare(b.name))
      .transform(removeDefaultValueTransform)
      .write(writers.default),

    "component-sets": createPipeline()
      .source(sources.componentSets)
      .filter(({ name }) => name.startsWith("🔵 ") || name.startsWith("🟢 "))
      .sort((a, b) => a.name.localeCompare(b.name))
      .transform(removeDefaultValueTransform)
      .write(writers.default),
  },
});

export default config;
