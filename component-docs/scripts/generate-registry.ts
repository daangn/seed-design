import { existsSync, promises as fs, readFileSync, readdirSync, unlinkSync } from "fs";
import path, { basename, join } from "node:path";
import chalk from "chalk";

import { match } from "ts-pattern";
import { dedent } from "ts-dedent";

// ts-node로 실행할 때 extension을 명시해주지 않으면 모듈을 찾지 못함.
import { componentMetadatas } from "../metadatas/component.js";

import { type ComponentMetadataSchema, componentRegistrySchema } from "../schemas/component.js";

const REGISTRY_PATH = path.join(process.cwd(), "public/registry");
const PUBLIC_PATH = path.join(process.cwd(), "public");
const SNIPPETS_PATH = path.join(process.cwd(), "snippets");

type RegistryType = "component";

interface GenerateRegistryIndexProps {
  metadatas: ComponentMetadataSchema[];
  type: RegistryType;
}
async function generateRegistryIndex({ metadatas, type }: GenerateRegistryIndexProps) {
  const metadatasJson = JSON.stringify(metadatas, null, 2);

  await fs.writeFile(path.join(REGISTRY_PATH, `${type}/index.json`), metadatasJson, "utf8");
}

interface GenerateRegistryProps {
  metadatas: ComponentMetadataSchema[];
  type: RegistryType;
}

async function generateRegistry({ metadatas, type }: GenerateRegistryProps) {
  const targetPath = path.join(REGISTRY_PATH, type);
  const mdxTargetPath = path.join(PUBLIC_PATH, "mdx", type);

  if (!existsSync(targetPath)) {
    await fs.mkdir(targetPath, { recursive: true });
  }

  for (const metadata of metadatas) {
    const registries = metadata.snippets
      ?.map((snippet) => {
        const snippetPath = path.join(SNIPPETS_PATH, snippet);

        if (!existsSync(snippetPath)) {
          console.log(
            chalk.red(
              `[Generate Registry] ${chalk.bgRed(metadata.name)} Snippet file does not exist!`,
            ),
          );
          return null;
        }

        const content = readFileSync(snippetPath, "utf8");

        const template = generateMDXTemplate({
          language: "tsx",
          template: content,
          copy: true,
          filename: `${metadata.name}.tsx`,
        });

        fs.writeFile(path.join(mdxTargetPath, `${metadata.name}.mdx`), template, "utf8");

        return {
          name: basename(snippet),
          content,
        };
      })
      .filter(Boolean);

    const removeSnipepts = {
      ...metadata,
      snippets: undefined,
    };

    const payload = {
      ...removeSnipepts,
      registries,
    };

    const parsedPayload = match(type)
      .with("component", () => componentRegistrySchema.parse(payload))
      .exhaustive();

    await fs.writeFile(
      path.join(targetPath, `${metadata.name}.json`),
      JSON.stringify(parsedPayload, null, 2),
      "utf8",
    );
  }
}

async function generateMDXRegistry(targetPath: string) {
  const targetMDXPath = path.join(PUBLIC_PATH, "mdx");
  const targetSnippetPath = path.join(SNIPPETS_PATH, "example", targetPath);

  if (!existsSync(targetMDXPath)) {
    console.log(chalk.red(`[Generate Registry] ${chalk.bgRed(targetMDXPath)} dir does not exist!`));
    await fs.mkdir(targetMDXPath, { recursive: true });
  }

  if (!existsSync(targetSnippetPath)) {
    console.log(
      chalk.red(`[Generate Registry] ${chalk.bgRed(targetSnippetPath)} dir does not exist!`),
    );
    await fs.mkdir(targetSnippetPath, { recursive: true });
  }

  const snippets = await fs.readdir(targetSnippetPath);
  for (const snippet of snippets) {
    const snippetPath = path.join(targetSnippetPath, snippet);

    if (!existsSync(snippetPath)) {
      console.log(
        chalk.red(`[Generate Registry] ${chalk.bgRed(targetPath)} Snippet file does not exist!`),
      );
      return null;
    }

    const content = readFileSync(snippetPath, "utf-8");
    const code = generateMDXTemplate({
      language: "tsx",
      template: content,
      copy: true,
    });
    const fileName = basename(snippet).split(".")[0];
    const writeDir = path.join(targetMDXPath, targetPath);

    if (!existsSync(writeDir)) {
      await fs.mkdir(writeDir, { recursive: true });
    }

    await fs.writeFile(path.join(writeDir, `${fileName}.mdx`), code, "utf-8");
  }
}

interface GenerateMDXTemplateProps {
  language: string;
  template: string;

  /**
   * @example ["1", "2-5", "3"]
   */
  highlightLines?: string[];

  /**
   * @example ["import", "export"]
   */
  subStrings?: string[];

  copy?: boolean;
  showLineNumbers?: boolean;

  /**
   * @example "BoxButtonPreview.tsx"
   */
  filename?: string;
}

function generateMDXTemplate(props: GenerateMDXTemplateProps) {
  const { language, highlightLines, subStrings, copy, showLineNumbers, filename, template } = props;

  const highlightLinesCode = highlightLines && `{${highlightLines.join(",")}}`;
  const subStringsCode = subStrings && `/${subStrings.join(",")}/`;
  const copyCode = copy && "copy";
  const showLineNumbersCode = showLineNumbers && "showLineNumbers";
  const filenameCode = filename && `filename="${filename}"`;
  const metas = [highlightLinesCode, subStringsCode, copyCode, showLineNumbersCode, filenameCode]
    .filter(Boolean)
    .join(" ");

  return dedent`
    \`\`\`${language} ${metas}
    ${template}
    \`\`\`\n
  `;
}

// biome-ignore lint/correctness/noUnusedVariables: <explanation>
const deleteAllFilesInDir = (dirPath: string): void => {
  if (!existsSync(dirPath)) {
    console.log(`Directory ${dirPath} does not exist.`);
    return;
  }

  try {
    // biome-ignore lint/complexity/noForEach: <explanation>
    readdirSync(dirPath).forEach((file) => {
      unlinkSync(join(dirPath, file));
    });
  } catch (error) {
    console.error(`Error while deleting files in directory ${dirPath}:`, error);
  }
};

function main() {
  console.log(chalk.gray("Generate Component Registry..."));

  generateRegistryIndex({ metadatas: componentMetadatas, type: "component" });
  generateRegistry({ metadatas: componentMetadatas, type: "component" });

  generateMDXRegistry("react");
  generateMDXRegistry("stackflow");

  console.log(chalk.green("Component Registry Generated !"));
}

main();
