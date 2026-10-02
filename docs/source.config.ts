import { remarkArchiveLinks } from "./app/_llms/archive-markdown";
import { REACT_ARCHIVE_VERSION } from "./lib/docs-archive";
import { fileGenerator, remarkDocGen } from "fumadocs-docgen";
import { defineConfig, defineDocs, frontmatterSchema } from "fumadocs-mdx/config";
import { remarkFigmaImage } from "./components/figma-image/remark-figma-image";
import { typeTableGenerator } from "./components/type-table/generator";
import { remarkReactTypeTable } from "./components/type-table/remark-react-type-table";
import lastModified from "fumadocs-mdx/plugins/last-modified";
import z from "zod";

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

const offline = process.env.SEED_DOCS_OFFLINE === "1";
if (!offline && (!process.env.FIGMA_FILE_KEY || !process.env.FIGMA_PERSONAL_ACCESS_TOKEN)) {
  throw new Error("FIGMA_FILE_KEY and FIGMA_PERSONAL_ACCESS_TOKEN are required");
}

function archiveFigmaImages() {
  if (offline) return;
  const fileKey = process.env.FIGMA_FILE_KEY;
  const accessToken = process.env.FIGMA_PERSONAL_ACCESS_TOKEN;
  if (!fileKey || !accessToken) throw new Error("Figma credentials are required for online builds");
  return remarkFigmaImage({ fileKey, accessToken, fetchUrlsOptions: { format: "png", scale: 2 } });
}

export default defineConfig({
  plugins: [lastModified()],
  mdxOptions: {
    remarkNpmOptions: {
      persist: {
        id: "package-manager",
      },
    },
    remarkPlugins: [
      [remarkArchiveLinks, REACT_ARCHIVE_VERSION],
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
      archiveFigmaImages,
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
