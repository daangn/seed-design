import { createConfig, createPipeline, sources, writers } from "@ride-developer/figma-extractor";

const config = createConfig({
  pipelines: {
    styles: createPipeline()
      .source(sources.styles)
      .sort((a, b) => a.name.localeCompare(b.name))
      .filter(({ style_type }) => style_type === "TEXT")
      .transform(({ name, key }) => ({ name, key }))
      .write(writers.default),
    "component-sets": createPipeline()
      .source(sources.componentSets)
      .sort((a, b) => a.name.localeCompare(b.name))
      .transform(({ name, key, componentPropertyDefinitions }) => ({
        name,
        key,
        componentPropertyDefinitions,
      }))
      .write(writers.default),
  },
});

export default config;
