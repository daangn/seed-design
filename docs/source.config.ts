import { fileGenerator, remarkDocGen } from "fumadocs-docgen";
import { defineConfig, defineDocs, frontmatterSchema } from "fumadocs-mdx/config";
import { remarkFigmaImage } from "./components/figma-image/remark-figma-image";
import { filteredTypeTableGenerator } from "./components/type-table/generator";
import { remarkAutoTypeTable } from "fumadocs-typescript";
import { remarkFixObjectKeys } from "./components/type-table/remark-fix-object-keys";
import lastModified from "fumadocs-mdx/plugins/last-modified";
import z from "zod";
import { env } from "@/app/env";

export const docs = defineDocs({
  dir: "content/docs",
  docs: {
    async: true,
    schema: frontmatterSchema.extend({
      deprecated: z.string().optional(),
      replacement: z.string().optional(),
      coverImageFigmaId: z.string().optional(),
    }),
    postprocess: {
      includeProcessedMarkdown: true,
    },
  },
});

export const reactDocs = defineDocs({
  dir: "content/react",
  docs: {
    async: true,
    schema: frontmatterSchema.extend({
      deprecated: z.string().optional(),
      replacement: z.string().optional(),
    }),
    postprocess: {
      includeProcessedMarkdown: true,
    },
  },
});

export const breezeDocs = defineDocs({
  dir: "content/breeze",
  docs: {
    async: true,
    schema: frontmatterSchema.extend({
      deprecated: z.string().optional(),
    }),
    postprocess: {
      includeProcessedMarkdown: true,
    },
  },
});

export const lynxDocs = defineDocs({
  dir: "content/lynx",
  docs: {
    async: true,
    schema: frontmatterSchema.extend({
      deprecated: z.string().optional(),
    }),
    postprocess: {
      includeProcessedMarkdown: true,
    },
  },
});

export const aiIntegrationDocs = defineDocs({
  dir: "content/ai-integration",
  docs: {
    async: true,
    schema: frontmatterSchema.extend({
      deprecated: z.string().optional(),
    }),
    postprocess: {
      includeProcessedMarkdown: true,
    },
  },
});

export default defineConfig({
  plugins: [lastModified()],
  mdxOptions: {
    remarkStructureOptions: {
      mdxTypes(node) {
        if (!node.children || node.children.length === 0) return true;

        switch (node.name) {
          case "TypeTable":
          case "Callout":
          case "Card":
            return true;
        }

        return false;
      },
      stringify: {
        filterElement: (node) => {
          if (node.type !== "mdxJsxFlowElement" && node.type !== "mdxJsxTextElement") return true;

          switch (node.name) {
            // fumadocs built-in
            case "File":
            case "TypeTable":
            case "Callout":
            case "Card":

            // SEED Docs specific
            case "FigmaImage":
            case "DoImage":
            case "DontImage":
              return true;
          }

          return "children-only";
        },
        filterMdxAttributes: (node, attribute) => {
          if (attribute.type !== "mdxJsxAttribute") return false;

          // if FigmaImage/DoImage/DontImage, remove src
          if (node.name === "FigmaImage" || node.name === "DoImage" || node.name === "DontImage")
            return attribute.name !== "src";

          return true;
        },
      },
    },
    remarkNpmOptions: {
      persist: {
        id: "package-manager",
      },
    },
    remarkPlugins: [
      [remarkDocGen, { generators: [fileGenerator()] }],
      [
        remarkAutoTypeTable,
        {
          generator: filteredTypeTableGenerator,
          name: "react-type-table",
          options: { basePath: process.cwd() },
        },
      ],
      remarkFixObjectKeys,
      [
        remarkFigmaImage,
        {
          fileKey: env.figmaFileKey,
          accessToken: env.figmaPersonalAccessToken,
          fetchUrlsOptions: {
            format: "png",
            scale: 2,
          },
        },
      ],
    ],
    rehypeCodeOptions: {
      lazy: true,
      langs: ["ts", "js", "html", "tsx", "mdx"],
      inline: "tailing-curly-colon",
      themes: {
        light: "github-light",
        dark: "github-dark",
      },
    },
  },
});
