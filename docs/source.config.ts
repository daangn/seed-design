import { fileGenerator, remarkDocGen, remarkInstall } from "fumadocs-docgen";
import { defineConfig, defineDocs } from "fumadocs-mdx/config";
import { typeTableGenerator } from "./components/type-table/generator";
import { remarkReactTypeTable } from "./components/type-table/remark-react-type-table";

export const docs = defineDocs({
  dir: "content/docs",
  docs: {
    async: true,
  },
});

export const reactDocs = defineDocs({
  dir: "content/react",
  docs: {
    async: true,
  },
});

export default defineConfig({
  lastModifiedTime: "git",
  mdxOptions: {
    remarkPlugins: [
      [
        remarkInstall,
        {
          persist: {
            id: "package-manager",
          },
        },
      ],
      [remarkDocGen, { generators: [fileGenerator()] }],
      [remarkReactTypeTable, { generator: typeTableGenerator }],
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
