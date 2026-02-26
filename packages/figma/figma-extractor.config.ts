import { createConfig, createPipeline, sources } from "@seed-design/figma-extractor";
import monochrome from "@karrotmarket/icon-data/monochrome.json" with { type: "json" };
import multicolor from "@karrotmarket/icon-data/multicolor.json" with { type: "json" };
import { camelCase, pascalCase } from "change-case";
import type { ComponentNode, ComponentSetNode } from "@figma/rest-api-spec";
import type { IconData, Style } from "./src/entities";

function ensureTrailingNewline(content: string): string {
  return content.endsWith("\n") ? content : `${content}\n`;
}

function getSafeIdentifierName(name: string) {
  const reservedWords = ["switch"];

  const transformed = camelCase(name.replace(/[^ -~]/g, "").replace(/ |\//g, " "));

  return reservedWords.includes(transformed) ? `_${transformed}` : transformed;
}

const PRIVATE_PATTERNS: RegExp[] = [
  /Field/,
  /Text Input/,
  /Textarea/,
  /Input Button/,
  /Alert Dialog/,
  /Bottom Sheet/,
  /Menu Sheet/,
  /Tabs/,
  /Tab Item/,
  /Top Navigation/,
  /Ghost Button/,
  /Chip/,
  /Segmented Control/,
  /Select Box/,
  /List Item/,
  /Slider/,
  /Tag/,
  /Page Banner/,
  /Bottom Action Bar/,
  /Identity Placeholder/,

  // FAB
  /Button Type/,
  /Menu Type/,
];

if (!process.env.FIGMA_FOUNDATIONS_FILE_KEY)
  throw new Error("FIGMA_FOUNDATIONS_FILE_KEY is not defined in environment variables.");

if (!process.env.FIGMA_COMPONENTS_FILE_KEY)
  throw new Error("FIGMA_COMPONENTS_FILE_KEY is not defined in environment variables.");

if (!process.env.FIGMA_TEMPLATES_FILE_KEY)
  throw new Error("FIGMA_TEMPLATES_FILE_KEY is not defined in environment variables.");

const ENV = {
  FIGMA_FOUNDATIONS_FILE_KEY: process.env.FIGMA_FOUNDATIONS_FILE_KEY,
  FIGMA_COMPONENTS_FILE_KEY: process.env.FIGMA_COMPONENTS_FILE_KEY,
  FIGMA_TEMPLATES_FILE_KEY: process.env.FIGMA_TEMPLATES_FILE_KEY,
};

const config = createConfig({
  fileKey: ".", // unused
  pipelines: {
    "component-sets": createPipeline()
      .source(async (ctx) => {
        const [componentsFile, templatesFile, publishedComponents, publishedTemplates] =
          await Promise.all([
            ctx.api.getFile({ ...ctx, file_key: ENV.FIGMA_COMPONENTS_FILE_KEY }),
            ctx.api.getFile({ ...ctx, file_key: ENV.FIGMA_TEMPLATES_FILE_KEY }),
            sources.componentSets({ ...ctx, fileKey: ENV.FIGMA_COMPONENTS_FILE_KEY }),
            sources.componentSets({ ...ctx, fileKey: ENV.FIGMA_TEMPLATES_FILE_KEY }),
          ]);

        // published IDs from sources.componentSets()
        const publishedComponentIdSet = new Set(publishedComponents.map((c) => c.id));
        const publishedTemplateIdSet = new Set(publishedTemplates.map((c) => c.id));

        // allowlisted private IDs from getFile() (exclude already published)
        const privateComponentIds = Object.entries(componentsFile.componentSets)
          .filter(
            ([id, set]) =>
              !publishedComponentIdSet.has(id) &&
              !set.remote &&
              PRIVATE_PATTERNS.some((pattern) => pattern.test(set.name)),
          )
          .map(([id]) => id);
        const privateTemplateIds = Object.entries(templatesFile.componentSets)
          .filter(
            ([id, set]) =>
              !publishedTemplateIdSet.has(id) &&
              !set.remote &&
              PRIVATE_PATTERNS.some((pattern) => pattern.test(set.name)),
          )
          .map(([id]) => id);

        const [componentNodes, templateNodes] = await Promise.all([
          ctx.fetchNodes({
            fileKey: ENV.FIGMA_COMPONENTS_FILE_KEY,
            nodeIds: [...publishedComponentIdSet, ...privateComponentIds],
          }),
          ctx.fetchNodes({
            fileKey: ENV.FIGMA_TEMPLATES_FILE_KEY,
            nodeIds: [...publishedTemplateIdSet, ...privateTemplateIds],
          }),
        ]);

        const privateComponentIdSet = new Set(privateComponentIds);
        const privateTemplateIdSet = new Set(privateTemplateIds);

        return [
          ...componentNodes.map((node) => ({
            ...node,
            prefix: privateComponentIdSet.has(node.document.id) ? "PrivateComponent" : "Component",
          })),
          ...templateNodes.map((node) => ({
            ...node,
            prefix: privateTemplateIdSet.has(node.document.id) ? "PrivateTemplate" : "Template",
          })),
        ];
      })
      .sort((a, b) => a.document.name.localeCompare(b.document.name))
      .transform(({ document: _document, componentSets, prefix }) => {
        const document = _document as ComponentSetNode;
        const { name, key, componentPropertyDefinitions } = {
          ...document,
          ...(componentSets?.[document.id] ?? {}),
        };

        return {
          name: getSafeIdentifierName(`${prefix}${name}`),
          key,
          ...(componentPropertyDefinitions && {
            componentPropertyDefinitions: Object.fromEntries(
              Object.entries(componentPropertyDefinitions).map(
                ([propKey, { defaultValue, preferredValues, ...rest }]) => [propKey, rest],
              ),
            ),
          }),
        };
      })
      .write(async (items, { utils, write, pipelineName }) => {
        const nameCount = new Map<string, number>();
        for (const item of items) {
          nameCount.set(item.name, (nameCount.get(item.name) ?? 0) + 1);
        }

        const getIdentifier = (item: (typeof items)[number]) => {
          const count = nameCount.get(item.name);
          return count !== undefined && count > 1
            ? `${item.name}_${item.key.slice(0, 3)}`
            : item.name;
        };

        const mjs = items.map((item) => utils.toMjs(getIdentifier(item), item).trim()).join("\n\n");
        const dts = items.map((item) => utils.toDts(getIdentifier(item), item).trim()).join("\n\n");

        await Promise.all([
          write(`${pipelineName}/index.mjs`, ensureTrailingNewline(mjs)),
          write(`${pipelineName}/index.d.ts`, ensureTrailingNewline(dts)),
        ]);
      }),

    components: createPipeline()
      .source(async (ctx) => {
        const [componentsFile, templatesFile, publishedComponents, publishedTemplates] =
          await Promise.all([
            ctx.api.getFile({ ...ctx, file_key: ENV.FIGMA_COMPONENTS_FILE_KEY }),
            ctx.api.getFile({ ...ctx, file_key: ENV.FIGMA_TEMPLATES_FILE_KEY }),
            sources.components({ ...ctx, fileKey: ENV.FIGMA_COMPONENTS_FILE_KEY }),
            sources.components({ ...ctx, fileKey: ENV.FIGMA_TEMPLATES_FILE_KEY }),
          ]);

        // published IDs from sources.components() - exclude components that belong to a component set
        const publishedComponentIdSet = new Set(
          publishedComponents.filter((c) => !c.componentSetId).map((c) => c.id),
        );
        const publishedTemplateIdSet = new Set(
          publishedTemplates.filter((c) => !c.componentSetId).map((c) => c.id),
        );

        // allowlisted private IDs from getFile() (exclude already published and components in component sets)
        const privateComponentIds = Object.entries(componentsFile.components)
          .filter(
            ([id, comp]) =>
              !publishedComponentIdSet.has(id) &&
              !comp.remote &&
              !comp.componentSetId &&
              PRIVATE_PATTERNS.some((pattern) => pattern.test(comp.name)),
          )
          .map(([id]) => id);
        const privateTemplateIds = Object.entries(templatesFile.components)
          .filter(
            ([id, comp]) =>
              !publishedTemplateIdSet.has(id) &&
              !comp.remote &&
              !comp.componentSetId &&
              PRIVATE_PATTERNS.some((pattern) => pattern.test(comp.name)),
          )
          .map(([id]) => id);

        const [componentNodes, templateNodes] = await Promise.all([
          ctx.fetchNodes({
            fileKey: ENV.FIGMA_COMPONENTS_FILE_KEY,
            nodeIds: [...publishedComponentIdSet, ...privateComponentIds],
          }),
          ctx.fetchNodes({
            fileKey: ENV.FIGMA_TEMPLATES_FILE_KEY,
            nodeIds: [...publishedTemplateIdSet, ...privateTemplateIds],
          }),
        ]);

        const privateComponentIdSet = new Set(privateComponentIds);
        const privateTemplateIdSet = new Set(privateTemplateIds);

        return [
          ...componentNodes.map((node) => ({
            ...node,
            prefix: privateComponentIdSet.has(node.document.id) ? "PrivateComponent" : "Component",
          })),
          ...templateNodes.map((node) => ({
            ...node,
            prefix: privateTemplateIdSet.has(node.document.id) ? "PrivateTemplate" : "Template",
          })),
        ];
      })
      .sort((a, b) => a.document.name.localeCompare(b.document.name))
      .transform(({ document: _document, components, prefix }) => {
        const document = _document as ComponentNode;
        const { name, key, componentPropertyDefinitions } = {
          ...document,
          ...(components?.[document.id] ?? {}),
        };

        return {
          name: getSafeIdentifierName(`${prefix}${name}`),
          key,
          ...(componentPropertyDefinitions && {
            componentPropertyDefinitions: Object.fromEntries(
              Object.entries(componentPropertyDefinitions).map(
                ([propKey, { defaultValue, preferredValues, ...rest }]) => [propKey, rest],
              ),
            ),
          }),
        };
      })
      .write(async (items, { utils, write, pipelineName }) => {
        const nameCount = new Map<string, number>();
        for (const item of items) {
          nameCount.set(item.name, (nameCount.get(item.name) ?? 0) + 1);
        }

        const getIdentifier = (item: (typeof items)[number]) => {
          const count = nameCount.get(item.name);
          return count !== undefined && count > 1
            ? `${item.name}_${item.key.slice(0, 3)}`
            : item.name;
        };

        const mjs = items.map((item) => utils.toMjs(getIdentifier(item), item).trim()).join("\n\n");
        const dts = items.map((item) => utils.toDts(getIdentifier(item), item).trim()).join("\n\n");

        await Promise.all([
          write(`${pipelineName}/index.mjs`, ensureTrailingNewline(mjs)),
          write(`${pipelineName}/index.d.ts`, ensureTrailingNewline(dts)),
        ]);
      }),

    variables: createPipeline()
      .source(
        async (ctx) => await sources.variables({ ...ctx, fileKey: ENV.FIGMA_FOUNDATIONS_FILE_KEY }),
      )
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
          write(`${pipelineName}/index.mjs`, ensureTrailingNewline(mjs)),
          write(`${pipelineName}/index.d.ts`, ensureTrailingNewline(dts)),
        ]);
      }),

    "variable-collections": createPipeline()
      .source(async ({ api }) => {
        const {
          meta: { variableCollections },
        } = await api.getLocalVariables({ file_key: ENV.FIGMA_FOUNDATIONS_FILE_KEY });

        return Object.values(variableCollections);
      })
      .filter(({ hiddenFromPublishing }) => !hiddenFromPublishing)
      .sort((a, b) => a.name.localeCompare(b.name))
      .transform(({ variableIds, ...rest }) => ({
        ...rest,
        variableIds: variableIds.sort((a, b) => a.localeCompare(b)),
      }))
      .write(async (items, { utils, write, pipelineName }) => {
        const record = Object.fromEntries(items.map((item) => [item.id, item]));

        const name = "FIGMA_VARIABLE_COLLECTIONS";

        const mjs = utils.toMjs(name, record);
        const dts = `import type { VariableCollection } from "../../../variable.interface";

export declare const FIGMA_VARIABLE_COLLECTIONS: Record<string, VariableCollection>;
`;

        await Promise.all([
          write(`${pipelineName}/index.mjs`, ensureTrailingNewline(mjs)),
          write(`${pipelineName}/index.d.ts`, ensureTrailingNewline(dts)),
        ]);
      }),

    styles: createPipeline()
      .source(
        async (ctx) => await sources.styles({ ...ctx, fileKey: ENV.FIGMA_FOUNDATIONS_FILE_KEY }),
      )
      .filter(
        ({ style_type }) =>
          style_type === "TEXT" || style_type === "FILL" || style_type === "EFFECT",
      )
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
          write(`${pipelineName}/index.mjs`, ensureTrailingNewline(mjs)),
          write(`${pipelineName}/index.d.ts`, ensureTrailingNewline(dts)),
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

        await Promise.all([
          write(`${pipelineName}/index.mjs`, ensureTrailingNewline(mjs)),
          write(`${pipelineName}/index.d.ts`, ensureTrailingNewline(dts)),
        ]);
      }),
  },
});

export default config;
