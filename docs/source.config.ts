import { fileGenerator, remarkDocGen } from "fumadocs-docgen";
import { remarkNpm } from "fumadocs-core/mdx-plugins";
import { defineConfig, defineDocs, frontmatterSchema } from "fumadocs-mdx/config";
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

export default defineConfig({
  lastModifiedTime: "git",
  mdxOptions: {
    remarkPlugins: [
      [
        remarkNpm,
        {
          persist: {
            id: "package-manager",
          },
        },
      ],
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
    ],
    rehypeCodeOptions: {
      lazy: true,
      experimentalJSEngine: true,
      langs: ["ts", "js", "html", "tsx", "mdx"],
      inline: "tailing-curly-colon",
      themes: {
        light: "github-light",
        dark: "github-dark",
      },
    },
  },
});
