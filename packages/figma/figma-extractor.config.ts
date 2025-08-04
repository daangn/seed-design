import { createConfig, createPipeline, sources, writers } from "@seed-design/figma-extractor";

const config = createConfig({
  pipelines: {
    components: createPipeline()
      .source(sources.components)
      .filter(
        ({ name, componentSetId }) =>
          (name.startsWith("🔵 ") || name.startsWith("🟢 ")) && componentSetId === undefined,
      )
      .sort((a, b) => a.name.localeCompare(b.name))
      // drop defaultValue and take the rest
      .transform(({ name, key, componentPropertyDefinitions }) => ({
        name,
        key,
        ...(componentPropertyDefinitions && {
          componentPropertyDefinitions: Object.fromEntries(
            Object.entries(componentPropertyDefinitions).map(([key, { defaultValue, ...rest }]) => [
              key,
              rest,
            ]),
          ),
        }),
      }))
      .write(writers.default),
    "component-sets": createPipeline()
      .source(sources.componentSets)
      .filter(({ name }) => name.startsWith("🔵 ") || name.startsWith("🟢 "))
      .sort((a, b) => a.name.localeCompare(b.name))
      // drop defaultValue and take the rest
      .transform(({ name, key, componentPropertyDefinitions }) => ({
        name,
        key,
        ...(componentPropertyDefinitions && {
          componentPropertyDefinitions: Object.fromEntries(
            Object.entries(componentPropertyDefinitions).map(([key, { defaultValue, ...rest }]) => [
              key,
              rest,
            ]),
          ),
        }),
      }))
      .write(writers.default),
  },
});

export default config;
