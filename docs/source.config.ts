import { fileGenerator, remarkDocGen } from "fumadocs-docgen";
import { defineConfig, defineDocs, frontmatterSchema } from "fumadocs-mdx/config";
import { remarkFigmaImage } from "./components/figma-image/remark-figma-image";
import { typeTableGenerator } from "./components/type-table/generator";
import { remarkReactTypeTable } from "./components/type-table/remark-react-type-table";
import z from "zod";

export const docs = defineDocs({
  dir: "content/docs",
  docs: {
    async: true,
    schema: frontmatterSchema.extend({
      deprecated: z.string().optional(),
    }),
  },
});

export const reactDocs = defineDocs({
  dir: "content/react",
  docs: {
    async: true,
    schema: frontmatterSchema.extend({
      deprecated: z.string().optional(),
    }),
  },
});

export const breezeDocs = defineDocs({
  dir: "content/breeze",
  docs: {
    async: true,
    schema: frontmatterSchema.extend({
      deprecated: z.string().optional(),
    }),
  },
});

export const lynxDocs = defineDocs({
  dir: "content/lynx",
  docs: {
    async: true,
    schema: frontmatterSchema.extend({
      deprecated: z.string().optional(),
    }),
  },
});

if (!process.env.FIGMA_FILE_KEY || !process.env.FIGMA_PERSONAL_ACCESS_TOKEN) {
  throw new Error("FIGMA_FILE_KEY and FIGMA_PERSONAL_ACCESS_TOKEN are required");
}

export default defineConfig({
  lastModifiedTime: "git",
  mdxOptions: {
    remarkNpmOptions: {
      persist: {
        id: "package-manager",
      },
    },
    remarkPlugins: [
      [remarkDocGen, { generators: [fileGenerator()] }],
      [
        remarkReactTypeTable,
        {
          generator: typeTableGenerator,
          options: {
            parseDescriptionAsMarkdown: true,
          },
        },
      ],
      [
        remarkFigmaImage,
        {
          fileKey: process.env.FIGMA_FILE_KEY,
          accessToken: process.env.FIGMA_PERSONAL_ACCESS_TOKEN,
          fetchUrlsOptions: {
            format: "jpg",
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
