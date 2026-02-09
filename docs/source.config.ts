import { fileGenerator, remarkDocGen } from "fumadocs-docgen";
import { defineConfig, defineDocs, frontmatterSchema } from "fumadocs-mdx/config";
import { remarkFigmaImage } from "./components/figma-image/remark-figma-image";
import { typeTableGenerator } from "./components/type-table/generator";
import { remarkReactTypeTable } from "./components/type-table/remark-react-type-table";
import lastModified from "fumadocs-mdx/plugins/last-modified";
import z from "zod";
import { env } from "@/app/env";

export const docs = defineDocs({
  dir: "content/docs",
  docs: {
    async: true,
    schema: frontmatterSchema.extend({
      deprecated: z.string().optional(),
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
