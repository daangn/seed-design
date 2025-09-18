import { createConfig, createPipeline, sources, writers } from "@seed-design/figma-extractor";

const config = createConfig({
  pipelines: {
    "component-sets": createPipeline()
      .source(sources.componentSets)
      .filter(({ name }) => name.startsWith("🔵 ") || name.startsWith("🟢 "))
      .sort((a, b) => a.name.localeCompare(b.name))
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
    variables: createPipeline()
      .source(sources.variables)
      .filter(({ hiddenFromPublishing }) => !hiddenFromPublishing)
      .sort((a, b) => a.name.localeCompare(b.name))
      .write(async (items, { utils, write, pipelineName }) => {
        const record = Object.fromEntries(items.map((item) => [item.id, item]));

        const name = "FIGMA_VARIABLES";

        const mjs = utils.toMjs(name, record);
        const dts = `import type { Variable } from "../../variable.interface";

export declare const FIGMA_VARIABLES: Record<string, Variable>
`;

        await write(`${pipelineName}/index.mjs`, mjs);
        await write(`${pipelineName}/index.d.ts`, dts);
      }),
    "variable-collections": createPipeline()
      .source(async ({ api, fileKey }) => {
        const {
          meta: { variableCollections },
        } = await api.getLocalVariables({ file_key: fileKey });

        return Object.values(variableCollections);
      })
      .filter(({ hiddenFromPublishing }) => !hiddenFromPublishing)
      .sort((a, b) => a.name.localeCompare(b.name))
      .write(async (items, { utils, write, pipelineName }) => {
        const record = Object.fromEntries(items.map((item) => [item.id, item]));

        const name = "FIGMA_VARIABLE_COLLECTIONS";

        const mjs = utils.toMjs(name, record);
        const dts = `import type { VariableCollection } from "../../variable.interface";

export declare const FIGMA_VARIABLE_COLLECTIONS: Record<string, VariableCollection>
`;

        await write(`${pipelineName}/index.mjs`, mjs);
        await write(`${pipelineName}/index.d.ts`, dts);
      }),
  },
});

export default config;
