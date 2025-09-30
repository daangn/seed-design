import { createConfig, createPipeline, sources, writers } from "@seed-design/figma-extractor";
import monochrome from "@karrotmarket/icon-data/monochrome.json" with { type: "json" };
import multicolor from "@karrotmarket/icon-data/multicolor.json" with { type: "json" };
import { pascalCase } from "change-case";
import type { IconData } from "./src/entities/icon.interface";
import type { Style } from "./src/entities/style.interface";

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
        const dts = `import type { Variable } from "../../../variable.interface";

export declare const FIGMA_VARIABLES: Record<string, Variable>;
`;

        await Promise.all([
          write(`${pipelineName}/index.mjs`, mjs),
          write(`${pipelineName}/index.d.ts`, dts),
        ]);
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
        const dts = `import type { VariableCollection } from "../../../variable.interface";

export declare const FIGMA_VARIABLE_COLLECTIONS: Record<string, VariableCollection>;
`;

        await Promise.all([
          write(`${pipelineName}/index.mjs`, mjs),
          write(`${pipelineName}/index.d.ts`, dts),
        ]);
      }),

    styles: createPipeline()
      .source(sources.styles)
      .filter(({ style_type }) => style_type === "TEXT" || style_type === "FILL")
      .transform(({ style_type, key, name, description }): Style => {
        return { styleType: style_type, key, name, description, remote: false };
      })
      .sort((a, b) => a.name.localeCompare(b.name))
      .write(async (items, { write, utils, pipelineName }) => {
        const name = "FIGMA_STYLES";

        const mjs = utils.toMjs(name, items);
        const dts = `import type { Style } from "../../../style.interface";

export declare const FIGMA_STYLES: Style[];
`;

        await Promise.all([
          write(`${pipelineName}/index.mjs`, mjs),
          write(`${pipelineName}/index.d.ts`, dts),
        ]);
      }),

    icons: createPipeline()
      .source(async (_ctx) => {
        const monochromeEntries: [string, IconData][] = Object.entries(monochrome)
          .sort(([nameA], [nameB]) => nameA.localeCompare(nameB))
          .map(([name, { figma }]) => {
            const weight = name.split("_").pop();
            const nameWithoutWeight = name.replace(new RegExp(`_${weight}$`), "");

            if (weight !== "line" && weight !== "fill") {
              throw new Error(`Unexpected icon name: ${name}`);
            }

            return [
              figma.key,
              { name: nameWithoutWeight, type: "monochrome", weight: pascalCase(weight) },
            ];
          });

        const multicolorEntries: [string, IconData][] = Object.entries(multicolor)
          .sort(([nameA], [nameB]) => nameA.localeCompare(nameB))
          .map(([name, { figma }]) => [figma.key, { name, type: "multicolor" }]);

        return [...monochromeEntries, ...multicolorEntries];
      })
      .write(async (items, { write, pipelineName, utils }) => {
        const record = Object.fromEntries(items);

        const name = "FIGMA_ICONS";

        const mjs = utils.toMjs(name, record);
        const dts = `import type { IconData } from "../../../icon.interface";
        
export declare const FIGMA_ICONS: Record<string, IconData>;
`;

        Promise.all([
          write(`${pipelineName}/index.mjs`, mjs),
          write(`${pipelineName}/index.d.ts`, dts),
        ]);
      }),
  },
});

export default config;
